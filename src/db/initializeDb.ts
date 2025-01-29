import { db } from './db';

// Define the default example goal as a constant
const DEFAULT_EXAMPLE_GOAL = {
  id: 'default-example-goal', // Fixed ID to identify the default goal
  name: 'Example - SMART Goal',
  areaOfFocus: 'Career Development',
  currentState: 'I want to improve my project management skills',
  futureState: 'Successfully lead and complete a major project',
  dueDate: '2024-12-31',
  actions: [{
    id: 'default-action-1',
    text: 'Take a Project Management course',
    isCompleted: false
  }, {
    id: 'default-action-2',
    text: 'Apply for project lead role',
    isCompleted: false
  }],
  milestones: [{
    id: 'default-milestone-1',
    text: 'Complete PM certification',
    isCompleted: false
  }, {
    id: 'default-milestone-2',
    text: 'Lead first team meeting',
    isCompleted: false
  }],
  createdAt: '2024-01-01T00:00:00.000Z' // Fixed creation date
};

const exampleSmartGoal = {
  id: 'example-goal',
  name: 'Example - SMART Goal',
  areaOfFocus: 'Professional Development',
  currentState: 'Currently managing small projects with basic project management tools',
  futureState: 'Confidently managing complex projects using advanced methodologies',
  actions: [
    {
      id: 'action-1',
      text: 'Complete Project Management certification',
      isCompleted: false
    },
    {
      id: 'action-2',
      text: 'Shadow senior project managers',
      isCompleted: false
    },
    {
      id: 'action-3',
      text: 'Implement new project tracking system',
      isCompleted: false
    }
  ],
  dueDate: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString(), // 6 months from now
  milestones: [
    {
      id: 'milestone-1',
      text: 'Complete PM certification coursework',
      isCompleted: false
    },
    {
      id: 'milestone-2',
      text: 'Lead first major project independently',
      isCompleted: false
    },
    {
      id: 'milestone-3',
      text: 'Implement and document three PM best practices',
      isCompleted: false
    }
  ],
  createdAt: new Date().toISOString()
};

export const initializeDb = async () => {
  try {
    // Clear old Zustand storage
    localStorage.removeItem('smart-goals-storage');
    
    // Check if this is first-time initialization
    const isFirstTime = localStorage.getItem('smart-goals-initialized') !== 'true';
    
    if (isFirstTime) {
      // Add the default example goal
      await db.smartGoals.add(DEFAULT_EXAMPLE_GOAL);
      
      // Mark as initialized
      localStorage.setItem('smart-goals-initialized', 'true');
      console.log('Added default example goal');
    }

    // Check if example goal exists
    const existingGoal = await db.smartGoals.get('example-goal');
    if (!existingGoal) {
      await db.smartGoals.add(exampleSmartGoal);
    }

    // Initialize other tables as needed
    // ... existing initialization code ...

  } catch (error) {
    console.error('Error initializing database:', error);
  }
}; 