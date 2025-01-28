import { create } from 'zustand';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, TrafficLightItem } from '../db/db';

interface TrafficLightItem {
  id: string;
  text: string;
  rating: number | null;
  notes: string;
  itemType?: 'daily' | 'training' | 'wider';
}

interface RoleData {
  [role: string]: {
    items: Record<string, TrafficLightItem[]>;
  };
}

interface TrafficLightStore {
  roleData: RoleData;
  selectedRole: string;
  initializeCategory: (role: string, category: string, defaultItems: string[]) => Promise<void>;
  addItem: (role: string, category: string, item: Omit<TrafficLightItem, 'role' | 'category'>) => Promise<void>;
  updateItem: (id: string, updates: Partial<TrafficLightItem>) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  setSelectedRole: (role: string) => void;
  getItemsForRole: (role: string, category: string) => Promise<TrafficLightItem[]>;
}

export const useTrafficLightStore = create<TrafficLightStore>((set, get) => ({
  roleData: {},
  selectedRole: 'graduate',
  
  setSelectedRole: (role) => set({ selectedRole: role }),

  initializeCategory: async (role, category, defaultItems) => {
    const existingItems = await db.trafficLightItems
      .where(['role', 'category'])
      .equals([role, category])
      .toArray();

    if (existingItems.length === 0) {
      const items = defaultItems.map((text) => ({
        id: crypto.randomUUID(),
        role,
        category,
        text,
        rating: null,
        notes: '',
        itemType: undefined,
      }));

      await db.trafficLightItems.bulkAdd(items);
    }
  },

  addItem: async (role, category, item) => {
    const fullItem = {
      ...item,
      role,
      category,
    };
    await db.trafficLightItems.add(fullItem);
  },

  updateItem: async (id, updates) => {
    await db.trafficLightItems.update(id, updates);
  },

  removeItem: async (id) => {
    await db.trafficLightItems.delete(id);
  },

  getItemsForRole: async (role, category) => {
    return await db.trafficLightItems
      .where(['role', 'category'])
      .equals([role, category])
      .toArray();
  },
}));

// Custom hook to get live items for a role and category
export const useTrafficLightItems = (role: string, category: string) => {
  return useLiveQuery(
    () => db.trafficLightItems
      .where(['role', 'category'])
      .equals([role, category])
      .toArray(),
    [role, category]
  ) || [];
};