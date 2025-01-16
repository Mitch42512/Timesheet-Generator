import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WeekNotesStore {
  notes: Record<string, string>;
  setNotes: (weekId: string, notes: string) => void;
  getNotes: (weekId: string) => string;
}

export const useWeekNotesStore = create<WeekNotesStore>()(
  persist(
    (set, get) => ({
      notes: {},
      setNotes: (weekId, notes) =>
        set((state) => ({
          notes: {
            ...state.notes,
            [weekId]: notes,
          },
        })),
      getNotes: (weekId) => get().notes[weekId] || '',
    }),
    {
      name: 'week-notes-storage',
      version: 1,
    }
  )
); 