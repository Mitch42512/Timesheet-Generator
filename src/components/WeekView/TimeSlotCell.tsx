import React, { useState, useRef, useEffect } from 'react';
import { Account } from '../../types';
import { X, ChevronDown } from 'lucide-react';
import { useAccountStore } from '../../store/useAccountStore';
import { useTimesheetStore } from '../../store/useTimesheetStore';
import { format } from 'date-fns';

interface TimeSlotCellProps {
  time: string;
  date: Date;
  isWeekend: boolean;
}

export const TimeSlotCell: React.FC<TimeSlotCellProps> = ({
  time,
  date,
  isWeekend,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { getActiveAccounts } = useAccountStore();
  const { addTimeEntry, removeTimeEntry, getTimeEntry } = useTimesheetStore();

  const weekId = format(date, 'yyyy-MM-dd');
  const slotId = `${weekId}-${time}`;
  const account = getTimeEntry(weekId, slotId);

  const { chargeable, nonChargeable, extra } = getActiveAccounts();

  // Check if the time slot is within business hours (9 AM to 5 PM)
  const hour = parseInt(time.split(':')[0]);
  const isBusinessHours = hour >= 9 && hour < 17;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAccountSelect = (selectedAccount: Account) => {
    addTimeEntry(weekId, slotId, selectedAccount);
    setIsDropdownOpen(false);
  };

  const handleRemove = () => {
    removeTimeEntry(weekId, slotId);
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
        ${isWeekend ? 'bg-[#DCE6F1]' : isBusinessHours ? 'bg-gray-50' : 'bg-white'}
        ${account ? '' : 'hover:bg-gray-100'}
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
              handleRemove();
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