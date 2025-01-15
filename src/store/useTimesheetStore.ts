import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Account } from '../types';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, eachWeekOfInterval, startOfMonth, endOfMonth } from 'date-fns';

interface TimesheetStore {
  timeEntries: Record<string, Record<string, Account>>;
  addTimeEntry: (weekId: string, slotId: string, account: Account) => void;
  removeTimeEntry: (weekId: string, slotId: string) => void;
  clearWeekEntries: (weekId: string) => void;
  getTimeEntry: (weekId: string, slotId: string) => Account | undefined;
  getWeekEntries: (weekId: string) => Record<string, Account>;
  getUniqueAccountsForWeek: (weekId: string) => Account[];
  getAccountHours: (weekId: string, accountId: string) => {
    daily: number[];
    total: number;
  };
  calculateWeekStats: (weekId: string) => {
    chargeableHours: number;
    utilization: number;
  };
  calculateMonthlyStats: (month: Date) => {
    chargeableHours: number;
    utilization: number;
  };
}

export const useTimesheetStore = create<TimesheetStore>()(
  persist(
    (set, get) => ({
      timeEntries: {},

      addTimeEntry: (weekId, slotId, account) => {
        set((state) => ({
          timeEntries: {
            ...state.timeEntries,
            [weekId]: {
              ...state.timeEntries[weekId],
              [slotId]: account,
            },
          },
        }));
      },

      removeTimeEntry: (weekId, slotId) =>
        set((state) => {
          const weekEntries = state.timeEntries[weekId] || {};
          const { [slotId]: _, ...rest } = weekEntries;
          return {
            timeEntries: {
              ...state.timeEntries,
              [weekId]: rest,
            },
          };
        }),

      clearWeekEntries: (weekId) => {
        const weekStart = new Date(weekId);
        const days = eachDayOfInterval({
          start: startOfWeek(weekStart, { weekStartsOn: 1 }),
          end: endOfWeek(weekStart, { weekStartsOn: 1 }),
        });

        set((state) => {
          const newTimeEntries = { ...state.timeEntries };
          days.forEach(day => {
            const dayId = format(day, 'yyyy-MM-dd');
            if (newTimeEntries[dayId]) {
              delete newTimeEntries[dayId];
            }
          });
          return { timeEntries: newTimeEntries };
        });
      },

      getTimeEntry: (weekId, slotId) => {
        const weekEntries = get().timeEntries[weekId] || {};
        return weekEntries[slotId];
      },

      getWeekEntries: (weekId) => {
        return get().timeEntries[weekId] || {};
      },

      getUniqueAccountsForWeek: (weekId) => {
        const weekStart = new Date(weekId);
        const days = eachDayOfInterval({
          start: startOfWeek(weekStart, { weekStartsOn: 1 }),
          end: endOfWeek(weekStart, { weekStartsOn: 1 }),
        });

        const uniqueAccounts = new Map<string, Account>();
        
        days.forEach(day => {
          const dayId = format(day, 'yyyy-MM-dd');
          const dayEntries = get().timeEntries[dayId] || {};
          
          Object.values(dayEntries).forEach(account => {
            if (!uniqueAccounts.has(account.id)) {
              uniqueAccounts.set(account.id, account);
            }
          });
        });

        return Array.from(uniqueAccounts.values());
      },

      getAccountHours: (weekId: string, accountId: string) => {
        const weekStart = new Date(weekId);
        const days = eachDayOfInterval({
          start: startOfWeek(weekStart, { weekStartsOn: 1 }),
          end: endOfWeek(weekStart, { weekStartsOn: 1 }),
        });

        const daily = days.map(day => {
          const dayId = format(day, 'yyyy-MM-dd');
          const dayEntries = get().timeEntries[dayId] || {};
          return Object.values(dayEntries).reduce((sum, account) => {
            if (account.id === accountId) {
              return sum + 0.5; // Each slot is 30 minutes
            }
            return sum;
          }, 0);
        });

        return {
          daily,
          total: daily.reduce((sum, hours) => sum + hours, 0),
        };
      },

      calculateWeekStats: (weekId) => {
        const weekStart = new Date(weekId);
        const days = eachDayOfInterval({
          start: startOfWeek(weekStart, { weekStartsOn: 1 }),
          end: endOfWeek(weekStart, { weekStartsOn: 1 }),
        });

        let chargeableHours = 0;
        days.forEach(day => {
          const dayId = format(day, 'yyyy-MM-dd');
          const dayEntries = get().timeEntries[dayId] || {};
          Object.values(dayEntries).forEach(account => {
            if (account.isChargeable && account.group !== 'extra') {
              chargeableHours += 0.5;
            }
          });
        });

        return {
          chargeableHours,
          utilization: (chargeableHours / 39) * 100,
        };
      },

      calculateMonthlyStats: (month) => {
        const weeks = eachWeekOfInterval({
          start: startOfMonth(month),
          end: endOfMonth(month),
        });

        let totalChargeableHours = 0;
        let weekCount = 0;

        weeks.forEach(weekStart => {
          const weekId = format(weekStart, 'yyyy-MM-dd');
          const weekStats = get().calculateWeekStats(weekId);
          totalChargeableHours += weekStats.chargeableHours;
          weekCount++;
        });

        const totalPossibleHours = weekCount * 39; // 39 hours per week
        const utilization = totalPossibleHours > 0 
          ? (totalChargeableHours / totalPossibleHours) * 100 
          : 0;

        return {
          chargeableHours: totalChargeableHours,
          utilization,
        };
      },
    }),
    {
      name: 'timesheet-storage',
      version: 1,
    }
  )
);