import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';

import { Entity } from '@/types/api';

export enum AccountGroup {
  CASH = 'CASH',
  CHEQUING = 'CHEQUING',
  CREDIT_CARD = 'CREDIT_CARD',
  SAVINGS = 'SAVINGS',
  INVESTMENTS = 'INVESTMENTS',
}

export type Account = Entity<{
  name: string;
  group: AccountGroup;
  balance: number;
  description: string;
  paymentAccountId: number | null;
  id: number;
  user_id: number;
  updated_at: string; // date time
  created_at: string; // date time
}>;

type State = {
  accounts: Account[];
  isLoading: boolean;
  error: Error | null;
};

type Actions = {
  setAccounts: (accounts: Account[]) => void;
  addAccount: (account: Account) => void;
  updateAccount: (id: number, updates: Partial<Account>) => void;
  deleteAccount: (id: number) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: Error | null) => void;
};

export const useAccountStore = create<State & Actions>()(
  devtools(
    immer((set) => ({
      accounts: [],
      isLoading: false,
      error: null,

      setAccounts: (accounts) =>
        set((state) => {
          state.accounts = accounts;
        }),
      addAccount: (account) =>
        set((state) => {
          state.accounts.push(account);
        }),
      updateAccount: (id, updates) =>
        set((state) => {
          const index = state.accounts.findIndex((acc) => acc.id === id);
          if (index !== -1) {
            Object.assign(state.accounts[index], updates);
          }
        }),
      deleteAccount: (id) =>
        set((state) => {
          state.accounts = state.accounts.filter((acc) => acc.id !== id);
        }),
      setLoading: (isLoading) =>
        set((state) => {
          state.isLoading = isLoading;
        }),
      setError: (error) =>
        set((state) => {
          state.error = error;
        }),
    })),
  ),
);
