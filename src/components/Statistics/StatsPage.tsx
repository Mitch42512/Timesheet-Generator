import React, { useState, useEffect } from 'react';
import { BarChart, PieChart, RefreshCw } from 'lucide-react';
import { format, startOfYear, eachMonthOfInterval } from 'date-fns';
import { useTimesheetStore } from '../../store/useTimesheetStore';
import { AccountHoursSummary } from './AccountHoursSummary';
import { useLiveQuery } from 'dexie-react-hooks';

interface MonthStats {
  month: string;
  stats: {
    chargeableHours: number;
    utilization: number;
  };
}

export const StatsPage: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const calculateMonthlyStats = useTimesheetStore((state) => state.calculateMonthlyStats);
  const yearStart = startOfYear(new Date(2025, 0, 1));
  const months = eachMonthOfInterval({
    start: yearStart,
    end: new Date(2025, 11, 31),
  });

  // Use live query to handle async stats calculation
  const monthlyStats = useLiveQuery(
    async () => {
      const stats: MonthStats[] = [];
      for (const month of months) {
        const monthStats = await calculateMonthlyStats(month);
        stats.push({
          month: format(month, 'MMMM'),
          stats: monthStats || { chargeableHours: 0, utilization: 0 }
        });
      }
      return stats;
    },
    [months]
  ) || [];

  const yearToDateStats = {
    totalChargeableHours: monthlyStats.reduce((sum, { stats }) => sum + stats.chargeableHours, 0),
    averageUtilization: monthlyStats.length > 0 
      ? monthlyStats.reduce((sum, { stats }) => sum + stats.utilization, 0) / monthlyStats.length
      : 0
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <BarChart className="w-6 h-6" />
            Monthly Utilization
          </h2>
          <button
            onClick={handleRefresh}
            className={`p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-all ${
              isRefreshing ? 'animate-spin' : ''
            }`}
            disabled={isRefreshing}
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          {monthlyStats.map(({ month, stats }) => (
            <div key={month} className="flex items-center gap-4">
              <div className="w-32">{month}</div>
              <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${Math.min(stats.utilization, 100)}%` }}
                />
              </div>
              <div className="w-16 text-right font-medium">
                {stats.utilization.toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <PieChart className="w-6 h-6" />
          Year to Date Summary
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-500">Total Chargeable Hours</div>
            <div className="text-2xl font-bold text-blue-600">
              {yearToDateStats.totalChargeableHours.toFixed(1)}
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-500">Average Utilization</div>
            <div className="text-2xl font-bold text-blue-600">
              {yearToDateStats.averageUtilization.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      <AccountHoursSummary />
    </div>
  );
};