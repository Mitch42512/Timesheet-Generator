import React from 'react';
import { DayColumn } from './DayColumn';
import { AccountSelector } from './AccountSelector';
import { UtilizationSidebar } from './UtilizationSidebar';
import { useAccountStore } from '../../store/useAccountStore';
import { useTimesheetStore } from '../../store/useTimesheetStore';
import { format, addDays, startOfWeek } from 'date-fns';

interface WeekViewProps {
  selectedWeek: Date;
}

export const WeekView: React.FC<WeekViewProps> = ({ selectedWeek }) => {
  const accounts = useAccountStore((state) => 
    state.accounts.filter(account => account.isActive && account.group)
  );
  
  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
  const weekId = format(weekStart, 'yyyy-MM-dd');
  
  const {
    getWeekEntries,
    addTimeEntry,
    removeTimeEntry,
    getUniqueAccountsForWeek,
    calculateWeekStats
  } = useTimesheetStore();

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const weekEntries = getWeekEntries(weekId);
  const weekStats = calculateWeekStats(weekId);

  const handleSlotUpdate = (date: Date, time: string, account: Account | undefined) => {
    const slotId = `${format(date, 'yyyy-MM-dd')}-${time}`;
    if (account) {
      addTimeEntry(weekId, slotId, account);
    } else {
      removeTimeEntry(weekId, slotId);
    }
  };

  return (
    <div className="flex">
      {/* Account Selection Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200">
        <AccountSelector />
      </div>

      {/* Calendar and Utilization */}
      <div className="flex-1">
        <div className="flex">
          {/* Time Periods */}
          <div className="w-16 flex-shrink-0">
            <div className="h-[72px]" /> {/* Header spacing */}
            {generateTimeSlots().map((time) => (
              <div
                key={time}
                className="h-8 flex items-center justify-end pr-2 text-xs text-gray-500"
              >
                {time}
              </div>
            ))}
          </div>

          {/* Calendar */}
          <div className="flex flex-1">
            {weekDays.map((date, index) => {
              const isWeekend = index >= 5;
              const dayTimeSlots: { [key: string]: Account | undefined } = {};
              
              Object.entries(weekEntries).forEach(([slotId, account]) => {
                const [dateStr, timeStr] = slotId.split('-');
                if (dateStr === format(date, 'yyyy-MM-dd')) {
                  dayTimeSlots[timeStr] = account;
                }
              });

              return (
                <DayColumn
                  key={date.toISOString()}
                  date={date}
                  timeSlots={dayTimeSlots}
                  onSlotUpdate={(time, account) => handleSlotUpdate(date, time, account)}
                  isWeekend={isWeekend}
                  width={isWeekend ? 'w-[110px]' : 'w-[120px]'}
                />
              );
            })}
          </div>

          {/* Utilization Sidebar */}
          <div className="flex-1 ml-2.5">
            <UtilizationSidebar 
              weekId={weekId}
              stats={weekStats}
              selectedWeek={selectedWeek}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 7; hour <= 19; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    slots.push(`${hour.toString().padStart(2, '0')}:30`);
  }
  return slots;
};