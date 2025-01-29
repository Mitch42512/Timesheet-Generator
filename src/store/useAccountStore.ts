import { create } from 'zustand';
import { db, Account } from '../db/db';

interface AccountStore {
  accounts: Account[];
  initialized: boolean;
  loadAccounts: () => Promise<void>;
  addAccount: (account: Account) => Promise<void>;
  updateAccount: (id: string, updates: Partial<Account>) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
  moveAccount: (accountId: string, groupId: string) => Promise<void>;
  updateAccountOrder: (newAccounts: Account[]) => Promise<void>;
  getActiveAccounts: () => {
    chargeable: Account[];
    nonChargeable: Account[];
    extra: Account[];
  };
}

export const useAccountStore = create<AccountStore>()((set, get) => ({
  accounts: [],
  initialized: false,

  loadAccounts: async () => {
    if (get().initialized) return;
    console.log('🔄 Loading accounts from IndexedDB...');
    try {
      const accounts = await db.accounts.toArray();
      console.log('✅ Loaded accounts:', accounts);
      set({ accounts, initialized: true });
    } catch (error) {
      console.error('❌ Failed to load accounts:', error);
      throw error;
    }
  },

  addAccount: async (account) => {
    console.log('➕ Adding new account:', account);
    try {
      await db.accounts.add(account);
      const accounts = await db.accounts.toArray();
      console.log('✅ Account added successfully');
      set({ accounts });
    } catch (error) {
      console.error('❌ Failed to add account:', error);
      throw error;
    }
  },

  updateAccount: async (id, updates) => {
    console.log('🔄 Updating account:', id, updates);
    try {
      await db.accounts.update(id, updates);
      const accounts = await db.accounts.toArray();
      console.log('✅ Account updated successfully');
      set({ accounts });
    } catch (error) {
      console.error('❌ Failed to update account:', error);
      throw error;
    }
  },

  deleteAccount: async (id) => {
    console.log('🗑️ Deleting account:', id);
    try {
      await db.accounts.delete(id);
      const accounts = await db.accounts.toArray();
      console.log('✅ Account deleted successfully');
      set({ accounts });
    } catch (error) {
      console.error('❌ Failed to delete account:', error);
      throw error;
    }
  },

  moveAccount: async (accountId, groupId) => {
    console.log('🔄 Moving account:', accountId, 'to group:', groupId);
    try {
      await db.accounts.update(accountId, {
        group: groupId,
        isChargeable: groupId === 'chargeable'
      });
      const accounts = await db.accounts.toArray();
      console.log('✅ Account moved successfully');
      set({ accounts });
    } catch (error) {
      console.error('❌ Failed to move account:', error);
      throw error;
    }
  },

  updateAccountOrder: async (newAccounts) => {
    console.log('🔄 Updating account order');
    try {
      // Since we don't have an order field in the DB, we'll just update the local state
      set({ accounts: newAccounts });
      console.log('✅ Account order updated successfully');
    } catch (error) {
      console.error('❌ Failed to update account order:', error);
      throw error;
    }
  },

  getActiveAccounts: () => {
    const activeAccounts = get().accounts.filter(account => account.isActive && account.group);
    return {
      chargeable: activeAccounts.filter(account => account.isChargeable && account.group === 'chargeable'),
      nonChargeable: activeAccounts.filter(account => !account.isChargeable && account.group === 'non-chargeable'),
      extra: activeAccounts.filter(account => account.group === 'extra'),
    };
  },
}));