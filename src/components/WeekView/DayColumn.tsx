import React from 'react';
import { TimeSlotCell } from './TimeSlotCell';
import { format } from 'date-fns';

interface DayColumnProps {
  date: Date;
  isWeekend: boolean;
  width: string;
}

export const DayColumn: React.FC<DayColumnProps> = ({
  date,
  isWeekend,
  width,
}) => {
  const dayFormat = isWeekend ? 'ccc' : 'EEEE';

  return (
    <div className={`${width} flex-shrink-0`}>
      <div className={`
        text-center p-2 border-b border-gray-300
        ${isWeekend ? 'bg-[#DCE6F1]' : 'bg-[#4F81BD] text-white'}
      `}>
        <div className="font-medium">{format(date, dayFormat)}</div>
        <div className="text-sm">{format(date, 'dd/MM')}</div>
      </div>
      <div className="border-r border-gray-300">
        {generateTimeSlots().map((time) => (
          <TimeSlotCell
            key={time}
            time={time}
            date={date}
            isWeekend={isWeekend}
          />
        ))}
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