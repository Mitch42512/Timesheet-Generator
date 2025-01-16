import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  initializeCategory: (role: string, category: string, defaultItems: string[]) => void;
  addItem: (role: string, category: string, item: TrafficLightItem) => void;
  updateItem: (role: string, category: string, id: string, updates: Partial<TrafficLightItem>) => void;
  removeItem: (role: string, category: string, id: string) => void;
  setSelectedRole: (role: string) => void;
  getItemsForRole: (role: string, category: string) => TrafficLightItem[];
}

export const useTrafficLightStore = create<TrafficLightStore>()(
  persist(
    (set, get) => ({
      roleData: {},
      selectedRole: 'graduate',
      
      initializeCategory: (role, category, defaultItems) => {
        const existingItems = get().roleData[role]?.items[category];
        if (!existingItems) {
          set((state) => ({
            roleData: {
              ...state.roleData,
              [role]: {
                ...state.roleData[role],
                items: {
                  ...(state.roleData[role]?.items || {}),
                  [category]: defaultItems.map((text) => ({
                    id: crypto.randomUUID(),
                    text,
                    rating: null,
                    notes: '',
                    itemType: undefined,
                  })),
                },
              },
            },
          }));
        }
      },

      addItem: (role, category, item) =>
        set((state) => ({
          roleData: {
            ...state.roleData,
            [role]: {
              ...state.roleData[role],
              items: {
                ...(state.roleData[role]?.items || {}),
                [category]: [...(state.roleData[role]?.items[category] || []), item],
              },
            },
          },
        })),

      updateItem: (role, category, id, updates) =>
        set((state) => ({
          roleData: {
            ...state.roleData,
            [role]: {
              ...state.roleData[role],
              items: {
                ...(state.roleData[role]?.items || {}),
                [category]: (state.roleData[role]?.items[category] || []).map((item) =>
                  item.id === id ? { ...item, ...updates } : item
                ),
              },
            },
          },
        })),

      removeItem: (role, category, id) =>
        set((state) => ({
          roleData: {
            ...state.roleData,
            [role]: {
              ...state.roleData[role],
              items: {
                ...(state.roleData[role]?.items || {}),
                [category]: (state.roleData[role]?.items[category] || []).filter(
                  (item) => item.id !== id
                ),
              },
            },
          },
        })),

      setSelectedRole: (role) => set({ selectedRole: role }),
      
      getItemsForRole: (role, category) => {
        return get().roleData[role]?.items[category] || [];
      },
    }),
    {
      name: 'traffic-light-storage',
      version: 2,
    }
  )
);