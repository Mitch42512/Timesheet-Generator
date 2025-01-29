import { create } from 'zustand';
import { db, WeekStatus } from '../db/db';

interface WeekStore {
  updateWeekStatus: (weekId: string, status: WeekStatus) => Promise<void>;
  getWeekStatus: (weekId: string) => Promise<WeekStatus>;
}

export const useWeekStore = create<WeekStore>()((set, get) => ({
  updateWeekStatus: async (weekId, status) => {
    try {
      console.log('🔄 Updating week status:', { weekId, status });
      await db.weekStatuses.put({ weekId, status });
      console.log('✅ Week status updated successfully');
    } catch (error) {
      console.error('❌ Failed to update week status:', error);
      throw error;
    }
  },

  getWeekStatus: async (weekId) => {
    try {
      const entry = await db.weekStatuses.get(weekId);
      return entry?.status || 'not-started';
    } catch (error) {
      console.error('❌ Failed to get week status:', error);
      return 'not-started';
    }
  },
}));