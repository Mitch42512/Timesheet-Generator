import { TimeEntry } from '../types';
import { startOfWeek, endOfWeek, parseISO, isWithinInterval } from 'date-fns';

export const calculateUtilization = (entries: TimeEntry[], weekStart: Date) => {
  const weekInterval = {
    start: startOfWeek(weekStart),
    end: endOfWeek(weekStart)
  };

  const weekEntries = entries.filter(entry => 
    isWithinInterval(parseISO(entry.date), weekInterval)
  );

  const totalHours = calculateTotalHours(weekEntries);
  const chargeableHours = calculateChargeableHours(weekEntries);
  
  return {
    totalHours,
    chargeableHours,
    utilization: (chargeableHours / 39) * 100
  };
};

const calculateTotalHours = (entries: TimeEntry[]) => {
  return entries.reduce((total, entry) => {
    const start = parseISO(entry.startTime);
    const end = parseISO(entry.endTime);
    return total + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  }, 0);
};

const calculateChargeableHours = (entries: TimeEntry[]) => {
  // Implementation will use account information to filter chargeable hours
  return 0; // Placeholder
};