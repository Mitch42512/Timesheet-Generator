import React from 'react';
import { format, startOfMonth, endOfMonth, eachWeekOfInterval } from 'date-fns';
import { CalendarDays } from 'lucide-react';

interface WeekListProps {
  currentDate: Date;
  onWeekSelect: (date: Date) => void;
  selectedWeek: Date | null;
}

export const WeekList: React.FC<WeekListProps> = ({
  currentDate,
  onWeekSelect,
  selectedWeek,
}) => {
  const monthInterval = {
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  };

  const weeks = eachWeekOfInterval(monthInterval);

  return (
    <div className="space-y-2 p-4">
      {weeks.map((weekStart) => (
        <button
          key={weekStart.toISOString()}
          onClick={() => onWeekSelect(weekStart)}
          className={`
            w-full flex items-center p-3 rounded-lg transition-colors
            ${
              selectedWeek &&
              format(selectedWeek, 'yyyy-MM-dd') === format(weekStart, 'yyyy-MM-dd')
                ? 'bg-blue-50 text-blue-700'
                : 'hover:bg-gray-50'
            }
          `}
        >
          <CalendarDays className="w-5 h-5 mr-3" />
          <span>
            Week of {format(weekStart, 'MMM d')}
          </span>
        </button>
      ))}
    </div>
  );
};