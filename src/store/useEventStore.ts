import { create } from 'zustand';
import { db } from '../db/db';
import type { Event } from '../db/db';

interface EventStore {
  events: Event[];
  isLoading: boolean;
  loadEvents: () => Promise<void>;
  addEvent: (event: Omit<Event, 'id' | 'isDefault'>) => Promise<void>;
  removeEvent: (id: string) => Promise<void>;
}

export const useEventStore = create<EventStore>()((set, get) => ({
  events: [],
  isLoading: true,

  loadEvents: async () => {
    try {
      const events = await db.events.toArray();
      set({ events, isLoading: false });
    } catch (error) {
      console.error('Error loading events:', error);
      set({ isLoading: false });
    }
  },

  addEvent: async (event) => {
    try {
      const newEvent: Event = {
        ...event,
        id: crypto.randomUUID(),
        isDefault: 0 as const
      };
      await db.events.add(newEvent);
      const events = await db.events.toArray();
      set({ events });
    } catch (error) {
      console.error('Error adding event:', error);
    }
  },

  removeEvent: async (id) => {
    try {
      const event = await db.events.get(id);
      if (event?.isDefault === 1) {
        console.warn('Cannot delete default event');
        return;
      }
      await db.events.delete(id);
      const events = await db.events.toArray();
      set({ events });
    } catch (error) {
      console.error('Error removing event:', error);
    }
  }
}));