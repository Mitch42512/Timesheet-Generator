import { create } from 'zustand';
import { db } from '../db/db';

interface UserStore {
  name: string;
  position: string;
  initialized: boolean;
  updateName: (name: string) => Promise<void>;
  updatePosition: (position: string) => Promise<void>;
  loadUserProfile: () => Promise<void>;
}

export const useUserStore = create<UserStore>()((set, get) => ({
  name: 'John Doe',
  position: 'Graduate',
  initialized: false,

  loadUserProfile: async () => {
    try {
      const profile = await db.userProfiles.get('default-profile');
      if (profile) {
        set({
          name: profile.name,
          position: profile.position,
          initialized: true
        });
      } else {
        // Create default profile if none exists
        await db.userProfiles.put({
          id: 'default-profile',
          name: 'John Doe',
          position: 'Graduate',
          updatedAt: new Date().toISOString()
        });
        set({ initialized: true });
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
      set({ initialized: true });
    }
  },

  updateName: async (name: string) => {
    try {
      await db.userProfiles.put({
        id: 'default-profile',
        name,
        position: get().position,
        updatedAt: new Date().toISOString()
      });
      set({ name });
    } catch (error) {
      console.error('Failed to update name:', error);
      throw error;
    }
  },

  updatePosition: async (position: string) => {
    try {
      await db.userProfiles.put({
        id: 'default-profile',
        name: get().name,
        position,
        updatedAt: new Date().toISOString()
      });
      set({ position });
    } catch (error) {
      console.error('Failed to update position:', error);
      throw error;
    }
  }
}));