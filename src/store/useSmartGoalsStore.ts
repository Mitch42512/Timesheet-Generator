import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Milestone {
  id: string;
  text: string;
  isCompleted: boolean;
}

export interface Action {
  id: string;
  text: string;
  isCompleted: boolean;
}

export interface SmartGoal {
  id: string;
  name: string;
  areaOfFocus: string;
  currentState: string;
  futureState: string;
  actions: Action[];
  dueDate: string;
  milestones: Milestone[];
  createdAt: string;
}

interface SmartGoalsStore {
  goals: SmartGoal[];
  addGoal: (goal: SmartGoal) => void;
  updateGoal: (id: string, updates: Partial<SmartGoal>) => void;
  deleteGoal: (id: string) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;
  toggleAction: (goalId: string, actionId: string) => void;
}

export const useSmartGoalsStore = create<SmartGoalsStore>()(
  persist(
    (set) => ({
      goals: [],
      addGoal: (goal) =>
        set((state) => ({
          goals: [...state.goals, goal],
        })),
      updateGoal: (id, updates) =>
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id ? { ...goal, ...updates } : goal
          ),
        })),
      deleteGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((goal) => goal.id !== id),
        })),
      toggleMilestone: (goalId, milestoneId) =>
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === goalId
              ? {
                  ...goal,
                  milestones: goal.milestones.map((milestone) =>
                    milestone.id === milestoneId
                      ? { ...milestone, isCompleted: !milestone.isCompleted }
                      : milestone
                  ),
                }
              : goal
          ),
        })),
      toggleAction: (goalId, actionId) =>
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === goalId
              ? {
                  ...goal,
                  actions: goal.actions.map((action) =>
                    action.id === actionId
                      ? { ...action, isCompleted: !action.isCompleted }
                      : action
                  ),
                }
              : goal
          ),
        })),
    }),
    {
      name: 'smart-goals-storage',
      version: 1,
    }
  )
);