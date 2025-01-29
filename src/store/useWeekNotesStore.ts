import { create } from 'zustand';
import { db } from '../db/db';

interface WeekNotesStore {
  setNotes: (weekId: string, notes: string) => Promise<void>;
  getNotes: (weekId: string) => Promise<string>;
}

export const useWeekNotesStore = create<WeekNotesStore>()((set, get) => ({
  setNotes: async (weekId, notes) => {
    try {
      console.log('🔄 Updating week notes:', { weekId });
      await db.weekNotes.put({ weekId, notes });
      console.log('✅ Week notes updated successfully');
    } catch (error) {
      console.error('❌ Failed to update week notes:', error);
      throw error;
    }
  },

  getNotes: async (weekId) => {
    try {
      const entry = await db.weekNotes.get(weekId);
      return entry?.notes || '';
    } catch (error) {
      console.error('❌ Failed to get week notes:', error);
      return '';
    }
  },
})); 