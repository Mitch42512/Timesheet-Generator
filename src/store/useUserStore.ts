import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserStore {
  name: string;
  position: string;
  avatarUrl: string | null;
  updateName: (name: string) => void;
  updatePosition: (position: string) => void;
  updateAvatar: (url: string) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      name: 'John Doe',
      position: 'Graduate',
      avatarUrl: null,
      updateName: (name) => set({ name }),
      updatePosition: (position) => set({ position }),
      updateAvatar: (url) => set({ avatarUrl: url }),
    }),
    {
      name: 'user-storage',
      version: 1,
    }
  )
);