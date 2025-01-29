import { create } from 'zustand';
import { db } from '../db/db';
import type { SmartGoal } from '../db/db';

interface SmartGoalsStore {
  goals: SmartGoal[];
  isLoading: boolean;
  loadGoals: () => Promise<void>;
  addGoal: (goal: SmartGoal) => Promise<void>;
  updateGoal: (id: string, updates: Partial<SmartGoal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  toggleMilestone: (goalId: string, milestoneId: string) => Promise<void>;
  toggleAction: (goalId: string, actionId: string) => Promise<void>;
}

export const useSmartGoalsStore = create<SmartGoalsStore>((set, get) => ({
  goals: [],
  isLoading: true,

  loadGoals: async () => {
    try {
      const goals = await db.smartGoals.toArray();
      set({ goals, isLoading: false });
    } catch (error) {
      console.error('Error loading goals:', error);
      set({ isLoading: false });
    }
  },

  addGoal: async (goal) => {
    try {
      await db.smartGoals.add(goal);
      const goals = await db.smartGoals.toArray();
      set({ goals });
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  },

  updateGoal: async (id, updates) => {
    try {
      await db.smartGoals.update(id, updates);
      const goals = await db.smartGoals.toArray();
      set({ goals });
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  },

  deleteGoal: async (id) => {
    try {
      // Don't allow deletion of the example goal
      if (id === 'example-goal') {
        console.warn('Cannot delete example goal');
        return;
      }
      await db.smartGoals.delete(id);
      const goals = await db.smartGoals.toArray();
      set({ goals });
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  },

  toggleMilestone: async (goalId, milestoneId) => {
    try {
      const goal = await db.smartGoals.get(goalId);
      if (!goal) return;

      const updatedMilestones = goal.milestones.map((milestone) =>
        milestone.id === milestoneId
          ? { ...milestone, isCompleted: !milestone.isCompleted }
          : milestone
      );

      await db.smartGoals.update(goalId, { milestones: updatedMilestones });
      const goals = await db.smartGoals.toArray();
      set({ goals });
    } catch (error) {
      console.error('Error toggling milestone:', error);
    }
  },

  toggleAction: async (goalId, actionId) => {
    try {
      const goal = await db.smartGoals.get(goalId);
      if (!goal) return;

      const updatedActions = goal.actions.map((action) =>
        action.id === actionId
          ? { ...action, isCompleted: !action.isCompleted }
          : action
      );

      await db.smartGoals.update(goalId, { actions: updatedActions });
      const goals = await db.smartGoals.toArray();
      set({ goals });
    } catch (error) {
      console.error('Error toggling action:', error);
    }
  },
}));