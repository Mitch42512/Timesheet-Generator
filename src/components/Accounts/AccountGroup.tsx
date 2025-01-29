import React from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DraggableAccount } from './DraggableAccount';
import { Account } from '../../db/db';

interface AccountGroupProps {
  title: string;
  accounts: Account[];
  groupId: string;
  onMoveAccount: (accountId: string, groupId: string) => Promise<void>;
  disabled: boolean;
}

export const AccountGroup: React.FC<AccountGroupProps> = ({
  title,
  accounts,
  groupId,
  onMoveAccount,
  disabled
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <SortableContext items={accounts.map(a => a.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {accounts.map((account) => (
            <DraggableAccount
              key={account.id}
              account={account}
              onMove={onMoveAccount}
              disabled={disabled}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};