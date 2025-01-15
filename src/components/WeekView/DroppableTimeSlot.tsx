import React, { useState, useEffect, useRef } from 'react';
import { Account } from '../../types';
import { X, ChevronDown } from 'lucide-react';
import { useAccountStore } from '../../store/useAccountStore';

interface DroppableTimeSlotProps {
  time: string;
  date: Date;
  isWeekend: boolean;
  account?: Account;
  onRemove?: () => void;
  onSelect: (account: Account) => void;
}

export const DroppableTimeSlot: React.FC<DroppableTimeSlotProps> = ({
  time,
  date,
  isWeekend,
  account,
  onRemove,
  onSelect,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { chargeable, nonChargeable, extra } = useAccountStore((state) => state.getActiveAccounts());

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAccountSelect = (selectedAccount: Account) => {
    onSelect(selectedAccount);
    setIsDropdownOpen(false);
  };

  const renderAccountSection = (title: string, accounts: Account[]) => (
    accounts.length > 0 && (
      <div>
        <div className="px-3 py-1 text-xs font-medium text-gray-500 bg-gray-50">
          {title}
        </div>
        {accounts.map((acc) => (
          <button
            key={acc.id}
            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
            onClick={() => handleAccountSelect(acc)}
          >
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: acc.color }} 
            />
            <span>{acc.jobId}</span>
          </button>
        ))}
      </div>
    )
  );

  return (
    <div
      className={`
        relative h-8 border-b border-gray-200 transition-colors group
        ${isWeekend ? 'bg-[#DCE6F1]' : 'bg-white'}
        ${account ? '' : 'hover:bg-gray-50'}
      `}
      style={account ? {
        backgroundColor: account.color,
        opacity: 0.8,
      } : undefined}
    >
      {account ? (
        <div className="absolute inset-0 flex items-center justify-between px-2">
          <span className="text-xs font-medium truncate flex-1">
            {account.jobId}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.();
            }}
            className="ml-1 p-1 hover:bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <button
          className="w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>
      )}

      {isDropdownOpen && !account && (
        <div 
          ref={dropdownRef}
          className="absolute left-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200 divide-y divide-gray-100"
        >
          {renderAccountSection('Chargeable Accounts', chargeable)}
          {renderAccountSection('Non-Chargeable', nonChargeable)}
          {renderAccountSection('Extra', extra)}
        </div>
      )}
    </div>
  );
};