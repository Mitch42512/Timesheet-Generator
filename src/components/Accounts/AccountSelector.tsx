import React from 'react';
import { Briefcase, Coffee, CircleDot } from 'lucide-react';
import { Account } from '../../types';

interface AccountSelectorProps {
  accounts: Account[];
  selectedAccountId: string | null;
  onAccountSelect: (accountId: string) => void;
}

export const AccountSelector: React.FC<AccountSelectorProps> = ({
  accounts,
  selectedAccountId,
  onAccountSelect,
}) => {
  const chargeableAccounts = accounts.filter(account => account.isChargeable && account.group !== 'extra');
  const nonChargeableAccounts = accounts.filter(account => !account.isChargeable && account.group !== 'extra');
  const extraAccounts = accounts.filter(account => account.group === 'extra');

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
            {chargeableAccounts.map((account) => (
              <button
                key={account.id}
                onClick={() => onAccountSelect(account.id)}
                className={`
                  w-full text-left px-3 py-2 rounded-md transition-colors
                  ${selectedAccountId === account.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'hover:bg-gray-50'
                  }
                `}
                style={{ borderLeft: `4px solid ${account.color}` }}
              >
                <div className="font-medium">{account.name}</div>
                {account.jobId && (
                  <div className="text-sm text-gray-500">{account.jobId}</div>
                )}
              </button>
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
            {nonChargeableAccounts.map((account) => (
              <button
                key={account.id}
                onClick={() => onAccountSelect(account.id)}
                className={`
                  w-full text-left px-3 py-2 rounded-md transition-colors
                  ${selectedAccountId === account.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'hover:bg-gray-50'
                  }
                `}
                style={{ borderLeft: `4px solid ${account.color}` }}
              >
                <div className="font-medium">{account.name}</div>
                {account.jobId && (
                  <div className="text-sm text-gray-500">{account.jobId}</div>
                )}
              </button>
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
            {extraAccounts.map((account) => (
              <button
                key={account.id}
                onClick={() => onAccountSelect(account.id)}
                className={`
                  w-full text-left px-3 py-2 rounded-md transition-colors
                  ${selectedAccountId === account.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'hover:bg-gray-50'
                  }
                `}
                style={{ borderLeft: `4px solid ${account.color}` }}
              >
                <div className="font-medium">{account.name}</div>
                {account.jobId && (
                  <div className="text-sm text-gray-500">{account.jobId}</div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};