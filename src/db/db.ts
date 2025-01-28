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

export class TrafficLightDB extends Dexie {
  trafficLightItems!: Table<TrafficLightItem>;

  constructor() {
    super('trafficLightDB');
    this.version(1).stores({
      trafficLightItems: 'id, [role+category]'
    });
  }
}

export const db = new TrafficLightDB(); 