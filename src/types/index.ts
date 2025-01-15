export type Account = {
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
};

export type TimeEntry = {
  id: string;
  accountId: string;
  date: string;
  startTime: string;
  endTime: string;
  notes?: string;
};

export type WeekStats = {
  totalHours: number;
  chargeableHours: number;
  utilization: number;
};