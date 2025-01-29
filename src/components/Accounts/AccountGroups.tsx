import React, { useState } from 'react';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove
} from '@dnd-kit/sortable';
import { AccountGroup } from './AccountGroup';
import { useAccountStore } from '../../store/useAccountStore';
import { Account } from '../../db/db';

export const AccountGroups: React.FC = () => {
  const accounts = useAccountStore((state) => state.accounts);
  const moveAccount = useAccountStore((state) => state.moveAccount);
  const updateAccountOrder = useAccountStore((state) => state.updateAccountOrder);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDragEnd = async (event: DragEndEvent) => {
    if (isProcessing) return;
    const { active, over } = event;

    if (over && active.id !== over.id) {
      try {
        setIsProcessing(true);
        const oldIndex = accounts.findIndex((account) => account.id === active.id);
        const newIndex = accounts.findIndex((account) => account.id === over.id);
        const newAccounts = arrayMove(accounts, oldIndex, newIndex);
        await updateAccountOrder(newAccounts);
      } catch (error) {
        console.error('Failed to update account order:', error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleMoveAccount = async (accountId: string, groupId: string) => {
    if (isProcessing) return;
    try {
      setIsProcessing(true);
      await moveAccount(accountId, groupId);
    } catch (error) {
      console.error('Failed to move account:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const chargeableAccounts = accounts.filter(
    (account) => account.isChargeable && account.group === 'chargeable'
  );
  const nonChargeableAccounts = accounts.filter(
    (account) => !account.isChargeable && account.group === 'non-chargeable'
  );
  const extraAccounts = accounts.filter(
    (account) => account.group === 'extra'
  );

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        <AccountGroup
          title="Chargeable Accounts"
          accounts={chargeableAccounts}
          groupId="chargeable"
          onMoveAccount={handleMoveAccount}
          disabled={isProcessing}
        />
        <AccountGroup
          title="Non-Chargeable"
          accounts={nonChargeableAccounts}
          groupId="non-chargeable"
          onMoveAccount={handleMoveAccount}
          disabled={isProcessing}
        />
        <AccountGroup
          title="Extra"
          accounts={extraAccounts}
          groupId="extra"
          onMoveAccount={handleMoveAccount}
          disabled={isProcessing}
        />
      </div>
    </DndContext>
  );
};