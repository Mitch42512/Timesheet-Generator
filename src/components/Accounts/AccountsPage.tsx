import React from 'react';
import { AccountForm } from './AccountForm';
import { AccountsTable } from './AccountsTable';
import { AccountGroups } from './AccountGroups';
import { useAccountStore } from '../../store/useAccountStore';
import { Briefcase, Coffee, CircleDot } from 'lucide-react';

export const AccountsPage: React.FC = () => {
  const accounts = useAccountStore((state) => state.accounts);
  
  // Filter active accounts by type
  const activeAccounts = accounts.filter(account => account.isActive);
  const chargeableAccounts = activeAccounts.filter(account => account.isChargeable && account.group !== 'extra');
  const nonChargeableAccounts = activeAccounts.filter(account => !account.isChargeable && account.group !== 'extra');
  const extraAccounts = activeAccounts.filter(account => account.group === 'extra');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Accounts Management</h1>
      
      {/* Top Section with Form and Overview */}
      <div className="flex gap-6">
        {/* Add New Account Form - 70% width */}
        <div className="flex-[0.7] bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Add New Account</h2>
          <AccountForm />
        </div>

        {/* Overview Section - 30% width */}
        <div className="flex-[0.3] bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Overview</h2>
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <div className="text-sm text-gray-500">Total Accounts</div>
                <div className="text-2xl font-bold text-[#4F81BD]">{accounts.length}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Active Accounts</div>
                <div className="text-2xl font-bold text-green-600">
                  {activeAccounts.length}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Chargeable</div>
                <div className="text-2xl font-bold text-orange-600">
                  {chargeableAccounts.length}
                </div>
              </div>
            </div>

            {/* Account Categories */}
            <div className="space-y-4">
              {/* Chargeable Accounts */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">Chargeable Accounts</span>
                </div>
                <div className="pl-7 space-y-1">
                  {chargeableAccounts.map(account => (
                    <div key={account.id} className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: account.color }} />
                      <span>{account.jobId || account.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Non-Chargeable Accounts */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <Coffee className="w-5 h-5 text-gray-600" />
                  <span className="font-medium">Non-Chargeable</span>
                </div>
                <div className="pl-7 space-y-1">
                  {nonChargeableAccounts.map(account => (
                    <div key={account.id} className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: account.color }} />
                      <span>{account.jobId || account.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Extra Accounts */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
                  <CircleDot className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium">Extra</span>
                </div>
                <div className="pl-7 space-y-1">
                  {extraAccounts.map(account => (
                    <div key={account.id} className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: account.color }} />
                      <span>{account.jobId || account.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Groups */}
      <div className="bg-white rounded-lg shadow">
        <AccountGroups />
      </div>

      {/* Full Width Accounts Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Accounts Table</h2>
        <AccountsTable accounts={accounts} />
      </div>
    </div>
  );
};