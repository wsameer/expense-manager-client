import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { IncomeCategory } from './types';

type State = {
  incomeCategories: IncomeCategory[];
  lastFetched: number;
  error: Error | null;
};

type Actions = {
  setIncomeCategories: (incomeCategories: IncomeCategory[]) => void;
  addIncomeCategory: (incomeCategory: IncomeCategory) => void;
  updateIncomeCategory: (id: number, updates: Partial<IncomeCategory>) => void;
  deleteIncomeCategory: (id: number) => void;
  setLastFetched: (timestamp: number) => void;
  setError: (error: Error | null) => void;
};

const initialState: State = {
  incomeCategories: [],
  lastFetched: 0,
  error: null,
};

export const useIncomeCategoriesStore = create<State & Actions>()(
  devtools(
    immer((set) => ({
      ...initialState,
      setIncomeCategories: (incomeCategories: IncomeCategory[]) =>
        set((state) => {
          state.incomeCategories = incomeCategories;
        }),
      updateIncomeCategory: (id: number, updates: Partial<IncomeCategory>) =>
        set((state) => {
          const index = state.incomeCategories.findIndex(
            (category) => category.id === id,
          );
          if (index !== -1) {
            Object.assign(state.incomeCategories[index], updates);
          }
        }),
      addIncomeCategory: (incomeCategory: IncomeCategory) =>
        set((state) => {
          state.incomeCategories.push(incomeCategory);
        }),
      deleteIncomeCategory: (id: number) =>
        set((state) => {
          state.incomeCategories = state.incomeCategories.filter(
            (category) => category.id !== id,
          );
        }),
      setLastFetched: (timestamp: number) => set({ lastFetched: timestamp }),
      setError: (error: Error | null) =>
        set((state) => {
          state.error = error;
        }),
    })),
  ),
);
