import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Account } from '../types';

interface AccountStore {
  accounts: Account[];
  addAccount: (account: Account) => void;
  updateAccount: (id: string, updates: Partial<Account>) => void;
  deleteAccount: (id: string) => void;
  moveAccount: (accountId: string, groupId: string) => void;
  updateAccountOrder: (newAccounts: Account[]) => void;
  getActiveAccounts: () => {
    chargeable: Account[];
    nonChargeable: Account[];
    extra: Account[];
  };
}

export const useAccountStore = create<AccountStore>()(
  persist(
    (set, get) => ({
      accounts: [
        {
          id: 'admin-1',
          name: 'Administrative',
          jobId: 'ADMIN',
          isChargeable: false,
          isActive: true,
          color: '#B8CCE4',
          group: 'non-chargeable'
        }
      ],
      
      addAccount: (account) =>
        set((state) => ({
          accounts: [...state.accounts, account],
        })),
        
      updateAccount: (id, updates) =>
        set((state) => ({
          accounts: state.accounts.map((account) =>
            account.id === id ? { ...account, ...updates } : account
          ),
        })),
        
      deleteAccount: (id) =>
        set((state) => ({
          accounts: state.accounts.filter((account) => account.id !== id),
        })),

      moveAccount: (accountId, groupId) =>
        set((state) => ({
          accounts: state.accounts.map((account) =>
            account.id === accountId
              ? {
                  ...account,
                  group: groupId,
                  isChargeable: groupId === 'chargeable',
                }
              : account
          ),
        })),

      updateAccountOrder: (newAccounts) =>
        set(() => ({
          accounts: newAccounts,
        })),

      getActiveAccounts: () => {
        const activeAccounts = get().accounts.filter(account => account.isActive && account.group);
        return {
          chargeable: activeAccounts.filter(account => account.isChargeable && account.group === 'chargeable'),
          nonChargeable: activeAccounts.filter(account => !account.isChargeable && account.group === 'non-chargeable'),
          extra: activeAccounts.filter(account => account.group === 'extra'),
        };
      },
    }),
    {
      name: 'account-storage',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          return {
            ...persistedState,
            accounts: persistedState.accounts || [],
          };
        }
        return persistedState;
      },
    }
  )
);