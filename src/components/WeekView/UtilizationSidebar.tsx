import React from 'react';
import { Account } from '../../types';
import { useTimesheetStore } from '../../store/useTimesheetStore';
import { useWeekStore } from '../../store/useWeekStore';
import { format } from 'date-fns';
import { Trash2, Check } from 'lucide-react';

interface UtilizationSidebarProps {
  weekId: string;
  stats: {
    chargeableHours: number;
    utilization: number;
  };
  selectedWeek: Date;
}

export const UtilizationSidebar: React.FC<UtilizationSidebarProps> = ({
  weekId,
  stats,
  selectedWeek,
}) => {
  const getUniqueAccountsForWeek = useTimesheetStore((state) => state.getUniqueAccountsForWeek);
  const getAccountHours = useTimesheetStore((state) => state.getAccountHours);
  const clearWeekEntries = useTimesheetStore((state) => state.clearWeekEntries);
  const updateWeekStatus = useWeekStore((state) => state.updateWeekStatus);
  const weekStatus = useWeekStore((state) => state.getWeekStatus(weekId));
  
  const uniqueAccounts = getUniqueAccountsForWeek(weekId);
  const hasEntries = uniqueAccounts.length > 0;

  const chargeableAccounts = uniqueAccounts.filter(account => account.isChargeable && account.group !== 'extra');
  const nonChargeableAccounts = uniqueAccounts.filter(account => !account.isChargeable && account.group !== 'extra');
  const extraAccounts = uniqueAccounts.filter(account => account.group === 'extra');

  React.useEffect(() => {
    if (hasEntries && weekStatus === 'not-started') {
      updateWeekStatus(weekId, 'in-progress');
    }
  }, [hasEntries, weekStatus, weekId, updateWeekStatus]);

  const handleClearCalendar = () => {
    if (window.confirm('Are you sure you want to clear all entries for this week? This action cannot be undone.')) {
      clearWeekEntries(weekId);
      updateWeekStatus(weekId, 'not-started');
    }
  };

  const handleSubmitWeek = () => {
    if (window.confirm('Are you sure you want to mark this week as completed?')) {
      updateWeekStatus(weekId, 'completed');
    }
  };

  const renderAccountRow = (account: Account) => {
    const hours = getAccountHours(weekId, account.id);
    return (
      <tr key={account.id} className="border-b border-gray-200">
        <td className="py-2 pl-2 pr-4 w-[120px]">
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0" 
              style={{ backgroundColor: account.color }} 
            />
            <span className="text-sm truncate">{account.jobId}</span>
          </div>
        </td>
        {hours.daily.map((value, index) => (
          <td key={index} className="py-2 px-2 text-center w-8">
            {value || '0.0'}
          </td>
        ))}
        <td className="py-2 px-2 text-center font-medium w-12">
          {hours.total.toFixed(1)}
        </td>
      </tr>
    );
  };

  const renderAccountSection = (title: string, accounts: Account[], bgColor: string) => (
    <div className="mb-6">
      <div className={`${bgColor} p-2`}>
        <div className="flex items-center">
          <div className="w-[120px] font-semibold">{title}</div>
          <div className="flex-1 grid grid-cols-8 gap-2 text-center text-sm">
            <div>M</div>
            <div>T</div>
            <div>W</div>
            <div>T</div>
            <div>F</div>
            <div>S</div>
            <div>S</div>
            <div>Hours</div>
          </div>
        </div>
      </div>
      <div className="bg-white">
        <table className="w-full">
          <tbody>
            {accounts.map(renderAccountRow)}
            {accounts.length === 0 && (
              <tr>
                <td colSpan={9} className="py-2 text-center text-sm text-gray-500">
                  No accounts selected
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="bg-white h-full">
      <div className="bg-[#4F81BD] text-white p-4">
        <div className="text-lg font-semibold">Utilisation</div>
        <div className="text-3xl font-bold">
          {stats.utilization.toFixed(1)}%
        </div>
        <div className="text-sm mt-1">Week {format(selectedWeek, 'w')}</div>
        <div className="text-sm mt-2">
          Status: <span className="font-medium capitalize">{weekStatus.replace('-', ' ')}</span>
        </div>
      </div>

      <div className="p-4">
        {renderAccountSection('Chargeable', chargeableAccounts, 'bg-[#FCD5B4]')}
        {renderAccountSection('Non-Chargeable', nonChargeableAccounts, 'bg-[#B8CCE4]')}
        {renderAccountSection('Extra', extraAccounts, 'bg-yellow-100')}

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={handleClearCalendar}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear Calendar
          </button>
          <button
            onClick={handleSubmitWeek}
            disabled={!hasEntries || weekStatus === 'completed'}
            className={`
              flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors
              ${weekStatus === 'completed'
                ? 'bg-green-100 text-green-800 cursor-not-allowed'
                : hasEntries
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            <Check className="w-4 h-4" />
            {weekStatus === 'completed' ? 'Submitted' : 'Submit Week'}
          </button>
        </div>
      </div>
    </div>
  );
};