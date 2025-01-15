import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Resource {
  id: string;
  type: 'url' | 'file';
  name: string;
  url?: string;
  data?: string;
  createdAt: string;
}

interface ResourceStore {
  resources: Resource[];
  addResource: (resource: Resource) => void;
  updateResource: (id: string, updates: Partial<Resource>) => void;
  removeResource: (id: string) => void;
}

export const useResourceStore = create<ResourceStore>()(
  persist(
    (set) => ({
      resources: [],
      addResource: (resource) =>
        set((state) => ({
          resources: [...state.resources, resource],
        })),
      updateResource: (id, updates) =>
        set((state) => ({
          resources: state.resources.map((resource) =>
            resource.id === id ? { ...resource, ...updates } : resource
          ),
        })),
      removeResource: (id) =>
        set((state) => ({
          resources: state.resources.filter((resource) => resource.id !== id),
        })),
    }),
    {
      name: 'resource-storage',
      version: 1,
    }
  )
);