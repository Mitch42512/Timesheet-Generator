import { create } from 'zustand';
import { db, Account } from '../db/db';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, eachWeekOfInterval, startOfMonth, endOfMonth } from 'date-fns';
import { useWeekStore } from './useWeekStore';

interface TimesheetStore {
  initialized: boolean;
  loadEntries: () => Promise<void>;
  addTimeEntry: (weekId: string, slotId: string, account: Account) => Promise<void>;
  removeTimeEntry: (weekId: string, slotId: string) => Promise<void>;
  clearWeekEntries: (weekId: string) => Promise<void>;
  getTimeEntry: (weekId: string, slotId: string) => Promise<Account | undefined>;
  getWeekEntries: (weekId: string) => Promise<Record<string, Account>>;
  getUniqueAccountsForWeek: (weekId: string) => Promise<Account[]>;
  getAccountHours: (weekId: string, accountId: string) => Promise<{
    daily: number[];
    total: number;
  }>;
  calculateWeekStats: (weekId: string) => Promise<{
    chargeableHours: number;
    utilization: number;
  }>;
  calculateMonthlyStats: (month: Date) => Promise<{
    chargeableHours: number;
    utilization: number;
  }>;
}

export const useTimesheetStore = create<TimesheetStore>()((set, get) => ({
  initialized: false,

  loadEntries: async () => {
    if (get().initialized) return;
    console.log('🔄 Loading timesheet entries...');
    try {
      const entries = await db.timesheetEntries.toArray();
      console.log('✅ Loaded timesheet entries:', entries);
      set({ initialized: true });
    } catch (error) {
      console.error('❌ Failed to load timesheet entries:', error);
      throw error;
    }
  },

  addTimeEntry: async (weekId, slotId, account) => {
    console.log('➕ Adding time entry:', { weekId, slotId, account });
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
      console.log('✅ Time entry added successfully');
    } catch (error) {
      console.error('❌ Failed to add time entry:', error);
      throw error;
    }
  },

  removeTimeEntry: async (weekId, slotId) => {
    console.log('🗑️ Removing time entry:', { weekId, slotId });
    try {
      await db.timesheetEntries
        .where(['weekId', 'slotId'])
        .equals([weekId, slotId])
        .delete();
      console.log('✅ Time entry removed successfully');
    } catch (error) {
      console.error('❌ Failed to remove time entry:', error);
      throw error;
    }
  },

  clearWeekEntries: async (weekId) => {
    console.log('🗑️ Clearing week entries:', weekId);
    try {
      const weekStart = new Date(weekId);
      const days = eachDayOfInterval({
        start: startOfWeek(weekStart, { weekStartsOn: 1 }),
        end: endOfWeek(weekStart, { weekStartsOn: 1 }),
      });

      // Delete entries for all days in the week
      await Promise.all(days.map(async (day) => {
        const dayId = format(day, 'yyyy-MM-dd');
        await db.timesheetEntries
          .where('weekId')
          .equals(dayId)
          .delete();
      }));
      
      console.log('✅ Week entries cleared successfully');
    } catch (error) {
      console.error('❌ Failed to clear week entries:', error);
      throw error;
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
      console.error('❌ Failed to get time entry:', error);
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
      console.error('❌ Failed to get week entries:', error);
      return {};
    }
  },

  getUniqueAccountsForWeek: async (weekId) => {
    try {
      const weekStart = new Date(weekId);
      const days = eachDayOfInterval({
        start: startOfWeek(weekStart, { weekStartsOn: 1 }),
        end: endOfWeek(weekStart, { weekStartsOn: 1 }),
      });

      const uniqueAccountIds = new Set<string>();
      
      for (const day of days) {
        const dayId = format(day, 'yyyy-MM-dd');
        const entries = await db.timesheetEntries
          .where('weekId')
          .equals(dayId)
          .toArray();
        
        entries.forEach(entry => uniqueAccountIds.add(entry.accountId));
      }

      const accounts = await Promise.all(
        Array.from(uniqueAccountIds).map(id => db.accounts.get(id))
      );

      return accounts.filter((account): account is Account => account !== undefined);
    } catch (error) {
      console.error('❌ Failed to get unique accounts for week:', error);
      return [];
    }
  },

  getAccountHours: async (weekId, accountId) => {
    try {
      const weekStart = new Date(weekId);
      const days = eachDayOfInterval({
        start: startOfWeek(weekStart, { weekStartsOn: 1 }),
        end: endOfWeek(weekStart, { weekStartsOn: 1 }),
      });

      const daily = await Promise.all(days.map(async day => {
        const dayId = format(day, 'yyyy-MM-dd');
        const entries = await db.timesheetEntries
          .where('weekId')
          .equals(dayId)
          .filter(entry => entry.accountId === accountId)
          .count();
        
        return entries * 0.5; // Each slot is 30 minutes
      }));

      return {
        daily,
        total: daily.reduce((sum, hours) => sum + hours, 0),
      };
    } catch (error) {
      console.error('❌ Failed to get account hours:', error);
      return { daily: Array(7).fill(0), total: 0 };
    }
  },

  calculateWeekStats: async (weekId) => {
    try {
      const weekStart = new Date(weekId);
      const days = eachDayOfInterval({
        start: startOfWeek(weekStart, { weekStartsOn: 1 }),
        end: endOfWeek(weekStart, { weekStartsOn: 1 }),
      });
  
      let chargeableHours = 0;
      let activeDays = 0; // number of weekdays with at least 1 entry
  
      for (const day of days) {
        const dayId = format(day, 'yyyy-MM-dd');
        const entries = await db.timesheetEntries
          .where('weekId')
          .equals(dayId)
          .toArray();
  
        if (entries.length > 0) {
          activeDays++;
        }
  
        for (const entry of entries) {
          const account = await db.accounts.get(entry.accountId);
          if (account?.isChargeable && account.group !== 'extra') {
            chargeableHours += 0.5; // each slot = 30 minutes
          }
        }
      }
  
      // expected baseline hours = 7.8h per active day
      const expectedHours = activeDays * 7.8;
      const utilization = expectedHours > 0 
        ? (chargeableHours / expectedHours) * 100 
        : 0;
  
      return { chargeableHours, utilization };
    } catch (error) {
      console.error('❌ Failed to calculate week stats:', error);
      return { chargeableHours: 0, utilization: 0 };
    }
  },

  calculateMonthlyStats: async (month) => {
    try {
      const weeks = eachWeekOfInterval({
        start: startOfMonth(month),
        end: endOfMonth(month),
      });
  
      let completedWeekCount = 0;
      let totalUtilization = 0;
  
      for (const weekStart of weeks) {
        const weekId = format(weekStart, 'yyyy-MM-dd');
  
        // check if week is completed
        const weekStatus = await useWeekStore.getState().getWeekStatus(weekId);
        if (weekStatus !== 'completed') {
          continue; // skip incomplete weeks
        }
  
        const weekStats = await get().calculateWeekStats(weekId);
        totalUtilization += weekStats.utilization;
        completedWeekCount++;
      }
  
      const avgUtilization =
        completedWeekCount > 0 ? totalUtilization / completedWeekCount : 0;
  
      return {
        chargeableHours: 0, // you could sum actual hours too if you want
        utilization: avgUtilization,
      };
    } catch (error) {
      console.error('❌ Failed to calculate monthly stats:', error);
      return { chargeableHours: 0, utilization: 0 };
    }
  },  
}));