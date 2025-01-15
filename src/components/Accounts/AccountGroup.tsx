import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DraggableAccount } from './DraggableAccount';
import { Account } from '../../types';

interface AccountGroupProps {
  title: string;
  accounts: Account[];
  groupId: string;
}

export const AccountGroup: React.FC<AccountGroupProps> = ({
  title,
  accounts,
  groupId,
}) => {
  const { setNodeRef } = useDroppable({
    id: groupId,
    data: { groupId },
  });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-700">{title}</h3>
      <div
        ref={setNodeRef}
        className="min-h-[100px] p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200"
      >
        <SortableContext items={accounts.map(a => a.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {accounts.map((account) => (
              <div key={account.id} className="flex items-center gap-2">
                <div className="flex-1">
                  <DraggableAccount account={account} />
                </div>
              </div>
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  );
};