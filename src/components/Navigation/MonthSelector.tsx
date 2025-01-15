import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addWeeks, subWeeks } from 'date-fns';

interface MonthSelectorProps {
  currentDate: Date;
  onMonthChange: (date: Date) => void;
}

export const MonthSelector: React.FC<MonthSelectorProps> = ({
  currentDate,
  onMonthChange,
}) => {
  const handlePreviousWeek = () => {
    onMonthChange(subWeeks(currentDate, 1));
  };

  const handleNextWeek = () => {
    onMonthChange(addWeeks(currentDate, 1));
  };

  return (
    <div className="flex items-center justify-between p-2 bg-[#4F81BD] text-white">
      <button
        onClick={handlePreviousWeek}
        className="p-1 hover:bg-[#385D8A] rounded"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <h2 className="text-lg font-semibold">
        Week {format(currentDate, 'w')}, {format(currentDate, 'MMMM')}
      </h2>
      <button
        onClick={handleNextWeek}
        className="p-1 hover:bg-[#385D8A] rounded"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};