import Dexie, { Table } from 'dexie';

export interface TrafficLightItem {
  id: string;
  role: string;
  category: string;
  text: string;
  rating: number | null;
  notes: string;
  itemType?: 'daily' | 'training' | 'wider';
}

export interface TimesheetEntry {
  id: string;
  weekId: string;
  slotId: string;
  accountId: string;
  date: string;
}

export interface Account {
  id: string;
  name: string;
  jobNumber?: string;
  jobId?: string;
  description?: string;
  isChargeable: boolean;
  isActive: boolean;
  color: string;
  group?: 'chargeable' | 'non-chargeable' | 'extra';
  budgetedHours?: number;
}

export interface UserImage {
  id: string;
  data: string;
  type: string;
  updatedAt: string;
}

export interface ProfileImage {
  id: string;
  data: string;
  type: string;
  updatedAt: string;
}

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

export interface UserProfile {
  id: string;
  name: string;
  position: string;
  updatedAt: string;
}

export type WeekStatus = 'completed' | 'in-progress' | 'not-started';

export interface WeekStatusEntry {
  weekId: string;
  status: WeekStatus;
}

export interface WeekNotes {
  weekId: string;
  notes: string;
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

export class AppDb extends Dexie {
  trafficLightItems!: Table<TrafficLightItem>;
  timesheetEntries!: Table<TimesheetEntry>;
  accounts!: Table<Account>;
  weekStatuses!: Table<WeekStatusEntry>;
  weekNotes!: Table<WeekNotes>;
  images!: Table<UserImage>;
  profileImages!: Table<ProfileImage>;
  userProfiles!: Table<UserProfile>;
  smartGoals!: Table<SmartGoal>;

  constructor() {
    super('AppDb');
    this.version(3).stores({
      trafficLightItems: 'id, [role+category]',
      timesheetEntries: 'id, [weekId+slotId], accountId, date',
      accounts: 'id, jobId, name, group',
      weekStatuses: 'weekId',
      weekNotes: 'weekId',
      images: 'id, updatedAt',
      profileImages: 'id, updatedAt',
      userProfiles: 'id, updatedAt',
      smartGoals: 'id, createdAt'
    });
  }
}

export const db = new AppDb();

// Make db available globally for debugging
(window as any).db = db;

export const resetDatabase = async () => {
  try {
    // Delete the databases
    await db.delete();
    await db.open();
    
    console.log('Database cleared and reopened');
    
    // Refresh the page to reset the application state
    window.location.reload();
  } catch (error) {
    console.error('Error resetting database:', error);
  }
};

// Make it available in console for debugging
(window as any).resetDatabase = resetDatabase; 