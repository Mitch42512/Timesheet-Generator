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
      for (const day of days) {
        const dayId = format(day, 'yyyy-MM-dd');
        const entries = await db.timesheetEntries
          .where('weekId')
          .equals(dayId)
          .toArray();

        const accountIds = entries.map(entry => entry.accountId);
        const accounts = await db.accounts
          .where('id')
          .anyOf(accountIds)
          .filter(account => account.isChargeable && account.group !== 'extra')
          .count();

        chargeableHours += accounts * 0.5;
      }

      return {
        chargeableHours,
        utilization: (chargeableHours / 39) * 100,
      };
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

      let totalChargeableHours = 0;
      let weekCount = 0;

      for (const weekStart of weeks) {
        const weekId = format(weekStart, 'yyyy-MM-dd');
        const weekStats = await get().calculateWeekStats(weekId);
        totalChargeableHours += weekStats.chargeableHours;
        weekCount++;
      }

      const totalPossibleHours = weekCount * 39; // 39 hours per week
      const utilization = totalPossibleHours > 0 
        ? (totalChargeableHours / totalPossibleHours) * 100 
        : 0;

      return {
        chargeableHours: totalChargeableHours,
        utilization,
      };
    } catch (error) {
      console.error('❌ Failed to calculate monthly stats:', error);
      return { chargeableHours: 0, utilization: 0 };
    }
  },
}));