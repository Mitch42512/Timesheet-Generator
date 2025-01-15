import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Event {
  id: string;
  title: string;
  date: string;
  type: 'holiday' | 'company' | 'personal';
}

interface EventStore {
  events: Event[];
  addEvent: (event: Omit<Event, 'id'>) => void;
  removeEvent: (id: string) => void;
}

export const useEventStore = create<EventStore>()(
  persist(
    (set) => ({
      events: [
        {
          id: '1',
          title: 'Christmas Party',
          date: '2025-12-20',
          type: 'company',
        },
        {
          id: '2',
          title: 'Easter Break',
          date: '2025-04-18',
          type: 'holiday',
        },
        {
          id: '3',
          title: 'June Break',
          date: '2025-06-15',
          type: 'holiday',
        },
      ],
      addEvent: (event) =>
        set((state) => ({
          events: [...state.events, { ...event, id: crypto.randomUUID() }],
        })),
      removeEvent: (id) =>
        set((state) => ({
          events: state.events.filter((event) => event.id !== id),
        })),
    }),
    {
      name: 'event-storage',
      version: 1,
    }
  )
);