import React from 'react';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DraggableAccount } from './DraggableAccount';
import { useAccountStore } from '../../store/useAccountStore';

export const AccountsDragDrop: React.FC = () => {
  const { accounts, selectedAccounts, toggleSelectedAccount } = useAccountStore();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      toggleSelectedAccount(active.id as string);
    }
  };

  const availableAccounts = accounts.filter(
    account => !selectedAccounts.includes(account.id)
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="border rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-500 mb-4">Available Accounts</h3>
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={availableAccounts.map(a => a.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {availableAccounts.map((account) => (
                <DraggableAccount key={account.id} account={account} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <div className="border rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-500 mb-4">Selected Accounts</h3>
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext 
            items={accounts
              .filter(account => selectedAccounts.includes(account.id))
              .map(a => a.id)} 
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {accounts
                .filter(account => selectedAccounts.includes(account.id))
                .map((account) => (
                  <DraggableAccount key={account.id} account={account} />
                ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};