import React, { useEffect, useState } from 'react';
import { useTimesheetStore } from '../../store/useTimesheetStore';
import { db, Account } from '../../db/db';

interface TimeSlotProps {
  weekId: string;
  slotId: string;
}

export const TimeSlot: React.FC<TimeSlotProps> = ({ weekId, slotId }) => {
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const getTimeEntry = useTimesheetStore(state => state.getTimeEntry);

  // Load existing entry
  useEffect(() => {
    const loadEntry = async () => {
      const entry = await getTimeEntry(weekId, slotId);
      if (entry) {
        setSelectedAccount(entry);
      }
    };
    loadEntry();
  }, [weekId, slotId, getTimeEntry]);

  useEffect(() => {
    if (isOpen) {
      const loadAccounts = async () => {
        const allAccounts = await db.accounts.toArray();
        console.log('Loaded accounts from IndexedDB:', allAccounts);
        setAccounts(allAccounts);
      };
      loadAccounts();
    }
  }, [isOpen]);

  console.log('TimeSlot render - isOpen:', isOpen);

  return (
    <div
      onClick={() => {
        console.log('Cell clicked - setting isOpen to:', !isOpen);
        setIsOpen(!isOpen);
      }}
      className={`h-full w-full cursor-pointer border border-gray-200 ${
        selectedAccount ? 'bg-blue-100' : ''
      }`}
    >
      {selectedAccount && (
        <div className="p-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: selectedAccount.color }} 
          />
          <span className="text-xs">{selectedAccount.jobId}</span>
        </div>
      )}
      {isOpen && !selectedAccount && (
        <div className="absolute z-10 mt-1 w-48 bg-white rounded-md shadow-lg">
          {accounts.map(account => (
            <button
              key={account.id}
              className="w-full px-4 py-2 text-left hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedAccount(account);
                setIsOpen(false);
              }}
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: account.color }} 
                />
                <span>{account.jobId}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}; 