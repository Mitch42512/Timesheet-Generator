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

export class AppDb extends Dexie {
  trafficLightItems!: Table<TrafficLightItem>;
  timesheetEntries!: Table<TimesheetEntry>;
  accounts!: Table<Account>;

  constructor() {
    super('AppDb');
    this.version(4).stores({
      trafficLightItems: 'id, [role+category]',
      timesheetEntries: 'id, [weekId+slotId], accountId, date',
      accounts: 'id, jobId, name, group'
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