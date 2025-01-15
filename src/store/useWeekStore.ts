import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WeekStatus {
  weekId: string;
  status: 'completed' | 'in-progress' | 'not-started';
}

interface WeekStore {
  weekStatuses: Record<string, WeekStatus>;
  updateWeekStatus: (weekId: string, status: WeekStatus['status']) => void;
  getWeekStatus: (weekId: string) => WeekStatus['status'];
}

export const useWeekStore = create<WeekStore>()(
  persist(
    (set, get) => ({
      weekStatuses: {},
      
      updateWeekStatus: (weekId, status) =>
        set((state) => ({
          weekStatuses: {
            ...state.weekStatuses,
            [weekId]: { weekId, status },
          },
        })),
        
      getWeekStatus: (weekId) =>
        get().weekStatuses[weekId]?.status || 'not-started',
    }),
    {
      name: 'week-status-storage',
      version: 1,
    }
  )
);