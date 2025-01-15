import React from 'react';
import { Briefcase, Coffee, CircleDot } from 'lucide-react';
import { useAccountStore } from '../../store/useAccountStore';

export const AccountSelector: React.FC = () => {
  const { chargeable, nonChargeable, extra } = useAccountStore((state) => state.getActiveAccounts());

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <div className="space-y-4">
        {/* Chargeable Accounts */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Chargeable Accounts
          </h3>
          <div className="space-y-1">
            {chargeable.map((account) => (
              <div
                key={account.id}
                className="px-3 py-2 rounded-md"
                style={{ borderLeft: `4px solid ${account.color}` }}
              >
                <div className="font-medium">{account.name}</div>
                {account.jobId && (
                  <div className="text-sm text-gray-500">{account.jobId}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Non-Chargeable Accounts */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
            <Coffee className="w-4 h-4" />
            Non-Chargeable
          </h3>
          <div className="space-y-1">
            {nonChargeable.map((account) => (
              <div
                key={account.id}
                className="px-3 py-2 rounded-md"
                style={{ borderLeft: `4px solid ${account.color}` }}
              >
                <div className="font-medium">{account.name}</div>
                {account.jobId && (
                  <div className="text-sm text-gray-500">{account.jobId}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Extra Accounts */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
            <CircleDot className="w-4 h-4" />
            Extra
          </h3>
          <div className="space-y-1">
            {extra.map((account) => (
              <div
                key={account.id}
                className="px-3 py-2 rounded-md"
                style={{ borderLeft: `4px solid ${account.color}` }}
              >
                <div className="font-medium">{account.name}</div>
                {account.jobId && (
                  <div className="text-sm text-gray-500">{account.jobId}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};