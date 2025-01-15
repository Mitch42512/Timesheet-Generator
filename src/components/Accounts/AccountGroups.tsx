import React, { useState } from 'react';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove
} from '@dnd-kit/sortable';
import { AccountGroup } from './AccountGroup';
import { useAccountStore } from '../../store/useAccountStore';

export const AccountGroups: React.FC = () => {
  const [activeTab, setActiveTab] = useState('chargeable');
  const { accounts, updateAccountOrder } = useAccountStore();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = accounts.findIndex(acc => acc.id === active.id);
      const newIndex = accounts.findIndex(acc => acc.id === over.id);
      updateAccountOrder(arrayMove(accounts, oldIndex, newIndex));
    }
  };

  const tabs = [
    { id: 'chargeable', label: 'Chargeable Accounts' },
    { id: 'non-chargeable', label: 'Non-Chargeable Accounts' },
    { id: 'extra', label: 'Extra' },
  ];

  const getFilteredAccounts = (groupId: string) => {
    return accounts.filter(account => {
      if (!account.isActive) return false;
      
      switch (groupId) {
        case 'chargeable':
          return account.isChargeable && (!account.group || account.group === 'chargeable');
        case 'non-chargeable':
          return !account.isChargeable && (!account.group || account.group === 'non-chargeable');
        case 'extra':
          return account.group === 'extra';
        default:
          return false;
      }
    });
  };

  return (
    <div>
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`
                py-4 px-6 text-sm font-medium border-b-2 
                ${activeTab === id
                  ? 'border-[#4F81BD] text-[#4F81BD]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      <DndContext 
        collisionDetection={closestCenter} 
        onDragEnd={handleDragEnd}
      >
        <div className="p-6">
          <AccountGroup
            title={tabs.find(t => t.id === activeTab)?.label || ''}
            accounts={getFilteredAccounts(activeTab)}
            groupId={activeTab}
          />
        </div>
      </DndContext>
    </div>
  );
};