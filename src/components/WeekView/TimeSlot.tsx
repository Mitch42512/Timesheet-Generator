import React from 'react';

interface TimeSlotProps {
  time: string;
  isSelected: boolean;
  isWeekend: boolean;
  showTime?: boolean;
  onClick: () => void;
}

export const TimeSlot: React.FC<TimeSlotProps> = ({
  time,
  isSelected,
  isWeekend,
  showTime = true,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        h-8 border-b border-gray-300 cursor-pointer transition-colors
        ${isWeekend ? 'bg-[#DCE6F1]' : 'bg-white'}
        ${isSelected ? 'bg-blue-100' : 'hover:bg-gray-50'}
      `}
    >
      <div className="flex items-center h-full px-2">
        {showTime && <span className="text-xs text-gray-600">{time}</span>}
      </div>
    </div>
  );
};