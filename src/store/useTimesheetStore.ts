import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { db, Account } from '../db/db';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, eachWeekOfInterval, startOfMonth, endOfMonth } from 'date-fns';

interface TimesheetStore {
  timeEntries: Record<string, Record<string, Account>>;
  addTimeEntry: (weekId: string, slotId: string, account: Account) => Promise<void>;
  removeTimeEntry: (weekId: string, slotId: string) => Promise<void>;
  clearWeekEntries: (weekId: string) => Promise<void>;
  getTimeEntry: (weekId: string, slotId: string) => Promise<Account | undefined>;
  getWeekEntries: (weekId: string) => Promise<Record<string, Account>>;
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

      addTimeEntry: async (weekId, slotId, account) => {
        try {
          // First ensure the account exists in the accounts table
          await db.accounts.put(account);

          const entry = {
            id: crypto.randomUUID(),
            weekId,
            slotId,
            accountId: account.id,
            date: weekId
          };

          await db.timesheetEntries.put(entry);
          
          // Update local state for immediate UI updates
          set(state => ({
            timeEntries: {
              ...state.timeEntries,
              [weekId]: {
                ...state.timeEntries[weekId],
                [slotId]: account
              }
            }
          }));
        } catch (error) {
          console.error('Error adding time entry:', error);
        }
      },

      removeTimeEntry: async (weekId, slotId) => {
        try {
          await db.timesheetEntries
            .where(['weekId', 'slotId'])
            .equals([weekId, slotId])
            .delete();

          // Update local state
          set(state => {
            const weekEntries = { ...state.timeEntries[weekId] };
            delete weekEntries[slotId];
            return {
              timeEntries: {
                ...state.timeEntries,
                [weekId]: weekEntries
              }
            };
          });
        } catch (error) {
          console.error('Error removing time entry:', error);
        }
      },

      getTimeEntry: async (weekId, slotId) => {
        try {
          const entry = await db.timesheetEntries
            .where(['weekId', 'slotId'])
            .equals([weekId, slotId])
            .first();

          if (entry) {
            const account = await db.accounts.get(entry.accountId);
            return account || undefined;
          }
          return undefined;
        } catch (error) {
          console.error('Error getting time entry:', error);
          return undefined;
        }
      },

      getWeekEntries: async (weekId) => {
        try {
          const entries = await db.timesheetEntries
            .where('weekId')
            .equals(weekId)
            .toArray();

          const accounts = await db.accounts.toArray();
          const accountMap = Object.fromEntries(
            accounts.map(account => [account.id, account])
          );

          return entries.reduce((acc, entry) => {
            const account = accountMap[entry.accountId];
            if (account) {
              acc[entry.slotId] = account;
            }
            return acc;
          }, {} as Record<string, Account>);
        } catch (error) {
          console.error('Error getting week entries:', error);
          return {};
        }
      },

      clearWeekEntries: async (weekId) => {
        try {
          await db.timesheetEntries
            .where('weekId')
            .equals(weekId)
            .delete();

          // Update local state
          set(state => {
            const { [weekId]: _, ...rest } = state.timeEntries;
            return { timeEntries: rest };
          });
        } catch (error) {
          console.error('Error clearing week entries:', error);
        }
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
      version: 2,
      storage: createJSONStorage(() => localStorage),
      migrate: async (persistedState: any, version: number) => {
        if (version === 1) {
          // Migrate old timesheet entries to IndexedDB
          const oldEntries = (persistedState as { timeEntries: Record<string, Record<string, Account>> }).timeEntries || {};
          
          // Batch process all entries
          const migratePromises = Object.entries(oldEntries).flatMap(([weekId, weekEntries]) =>
            Object.entries(weekEntries).map(async ([slotId, account]) => {
              // Store account
              await db.accounts.put(account);

              // Store timesheet entry
              const entry = {
                id: crypto.randomUUID(),
                weekId,
                slotId,
                accountId: account.id,
                date: weekId
              };
              await db.timesheetEntries.put(entry);
            })
          );

          await Promise.all(migratePromises);
        }
        return persistedState;
      }
    }
  )
);