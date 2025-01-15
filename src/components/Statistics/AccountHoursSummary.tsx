import React from 'react';
import { useAccountStore } from '../../store/useAccountStore';
import { useTimesheetStore } from '../../store/useTimesheetStore';
import { startOfYear, eachWeekOfInterval, format } from 'date-fns';
import { Account } from '../../types';

const AccountSummarySection: React.FC<{
  title: string;
  accounts: (Account & { totalHours: number })[];
  bgColor: string;
}> = ({ title, accounts, bgColor }) => (
  <div className="bg-white rounded-lg shadow p-6 mt-8">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {accounts.map(account => (
        <div
          key={account.id}
          className="flex items-center justify-between p-4 rounded-lg border"
          style={{ borderLeftColor: account.color, borderLeftWidth: '4px' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: account.color }}
            />
            <div>
              <div className="font-medium">{account.name}</div>
              <div className="text-sm text-gray-500">{account.jobId}</div>
              {account.budgetedHours && (
                <div className="text-xs text-gray-400">
                  of budgeted {account.budgetedHours} hrs
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-gray-700">
              {account.totalHours.toFixed(1)} hrs
            </div>
            {account.budgetedHours && (
              <div className="text-sm text-gray-500">
                {((account.totalHours / account.budgetedHours) * 100).toFixed(1)}%
              </div>
            )}
          </div>
        </div>
      ))}
      {accounts.length === 0 && (
        <div className="col-span-full text-center text-gray-500 py-4">
          No accounts found
        </div>
      )}
    </div>
  </div>
);

export const AccountHoursSummary: React.FC = () => {
  const accounts = useAccountStore((state) => state.accounts);
  const getAccountHours = useTimesheetStore((state) => state.getAccountHours);

  const calculateTotalHours = (accountId: string) => {
    const yearStart = startOfYear(new Date(2025, 0, 1));
    const weeks = eachWeekOfInterval({
      start: yearStart,
      end: new Date(2025, 11, 31),
    });

    return weeks.reduce((total, weekStart) => {
      const weekId = format(weekStart, 'yyyy-MM-dd');
      const { total: weekTotal } = getAccountHours(weekId, accountId);
      return total + weekTotal;
    }, 0);
  };

  const accountsWithHours = accounts
    .map(account => ({
      ...account,
      totalHours: calculateTotalHours(account.id),
    }))
    .filter(account => account.totalHours > 0);

  const chargeableAccounts = accountsWithHours
    .filter(account => account.isChargeable && account.group !== 'extra')
    .sort((a, b) => b.totalHours - a.totalHours);

  const nonChargeableAccounts = accountsWithHours
    .filter(account => !account.isChargeable && account.group !== 'extra')
    .sort((a, b) => b.totalHours - a.totalHours);

  const extraAccounts = accountsWithHours
    .filter(account => account.group === 'extra')
    .sort((a, b) => b.totalHours - a.totalHours);

  return (
    <>
      <AccountSummarySection 
        title="Total Hours by Chargeable Account" 
        accounts={chargeableAccounts}
        bgColor="bg-blue-50"
      />
      <AccountSummarySection 
        title="Total Hours by Non-Chargeable Account" 
        accounts={nonChargeableAccounts}
        bgColor="bg-gray-50"
      />
      <AccountSummarySection 
        title="Total Hours by Extra Account" 
        accounts={extraAccounts}
        bgColor="bg-yellow-50"
      />
    </>
  );
};