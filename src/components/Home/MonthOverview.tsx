import React, { useState, useEffect } from 'react';
import { format, addWeeks, parse } from 'date-fns';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useWeekStore } from '../../store/useWeekStore';

interface MonthOverviewProps {
  onWeekSelect: (date: Date) => void;
}

interface WeekData {
  weekNumber: number;
  startDate: Date;
}

interface MonthData {
  name: string;
  weeks: WeekData[];
}

export const MonthOverview: React.FC<MonthOverviewProps> = ({ onWeekSelect }) => {
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);
  const getWeekStatus = useWeekStore((state) => state.getWeekStatus);

  // Start with December 30, 2024 (Monday)
  const startDate = parse('2024-12-30', 'yyyy-MM-dd', new Date());

  const monthsData: MonthData[] = [
    { name: 'January', weeks: generateWeeks(1, 5, startDate) },
    { name: 'February', weeks: generateWeeks(6, 9, startDate) },
    { name: 'March', weeks: generateWeeks(10, 13, startDate) },
    { name: 'April', weeks: generateWeeks(14, 17, startDate) },
    { name: 'May', weeks: generateWeeks(18, 22, startDate) },
    { name: 'June', weeks: generateWeeks(23, 26, startDate) },
    { name: 'July', weeks: generateWeeks(27, 31, startDate) },
    { name: 'August', weeks: generateWeeks(32, 35, startDate) },
    { name: 'September', weeks: generateWeeks(36, 39, startDate) },
    { name: 'October', weeks: generateWeeks(40, 44, startDate) },
    { name: 'November', weeks: generateWeeks(45, 48, startDate) },
    { name: 'December', weeks: generateWeeks(49, 52, startDate) },
  ];

  // Handle clicking outside to collapse
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.month-container')) {
        setExpandedMonth(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMonth = (monthName: string) => {
    setExpandedMonth(expandedMonth === monthName ? null : monthName);
  };

  const getStatusColor = (weekId: string) => {
    const status = getWeekStatus(weekId);
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'not-started':
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md divide-y divide-gray-200">
      {monthsData.map((month) => {
        const isExpanded = expandedMonth === month.name;
        const completedWeeks = month.weeks.filter(w => 
          getWeekStatus(format(w.startDate, 'yyyy-MM-dd')) === 'completed'
        ).length;
        const progress = (completedWeeks / month.weeks.length) * 100;

        return (
          <div key={month.name} className="month-container">
            <button
              onClick={() => toggleMonth(month.name)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
                <span className="font-medium">{month.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500">{progress.toFixed(0)}%</span>
              </div>
            </button>

            {isExpanded && (
              <div className="bg-gray-50 p-4">
                <div className="grid grid-cols-4 gap-4">
                  {month.weeks.map((week) => {
                    const weekId = format(week.startDate, 'yyyy-MM-dd');
                    const status = getWeekStatus(weekId);
                    return (
                      <button
                        key={week.weekNumber}
                        onClick={() => onWeekSelect(week.startDate)}
                        className="text-left bg-white p-3 rounded-lg shadow-sm hover:shadow transition-shadow"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">Week {week.weekNumber}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(weekId)}`}>
                            {status.replace('-', ' ')}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {format(week.startDate, 'MMM d, yyyy')}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

function generateWeeks(startWeek: number, endWeek: number, baseDate: Date): WeekData[] {
  const weeks: WeekData[] = [];
  for (let weekNum = startWeek; weekNum <= endWeek; weekNum++) {
    const weekOffset = weekNum - 1; // Subtract 1 because we want week 1 to start with baseDate
    const startDate = addWeeks(baseDate, weekOffset);
    weeks.push({
      weekNumber: weekNum,
      startDate,
    });
  }
  return weeks;
}