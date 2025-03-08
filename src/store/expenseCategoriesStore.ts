import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export interface Subcategory {
  id: number;
  name: string;
}

export interface ExpenseCategory {
  id: number;
  name: string;
  is_default: boolean;
  order: number;
  subcategories: Subcategory[];
}

type State = {
  expenseCategories: ExpenseCategory[];
  isLoading: boolean;
  error: Error | null;
};

type Actions = {
  setExpenseCategories: (expenseCategories: ExpenseCategory[]) => void;
  addExpenseCategory: (expenseCategory: ExpenseCategory) => void;
  updateExpenseCategory: (
    id: number,
    updates: Partial<ExpenseCategory>,
  ) => void;
  deleteExpenseCategory: (id: number) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: Error | null) => void;
};

const initialState = {
  expenseCategories: [],
  isLoading: false,
  error: null,
};

export const useExpenseCategoriesStore = create<State & Actions>()(
  devtools(
    immer((set) => ({
      ...initialState,
      setExpenseCategories: (expenseCategories: ExpenseCategory[]) =>
        set((state) => {
          state.expenseCategories = expenseCategories;
        }),
      updateExpenseCategory: (id: number, updates: Partial<ExpenseCategory>) =>
        set((state) => {
          const index = state.expenseCategories.findIndex(
            (category) => category.id === id,
          );
          if (index !== -1) {
            Object.assign(state.expenseCategories[index], updates);
          }
        }),
      addExpenseCategory: (expenseCategory: ExpenseCategory) =>
        set((state) => {
          state.expenseCategories.push(expenseCategory);
        }),
      deleteExpenseCategory: (id: number) =>
        set((state) => {
          state.expenseCategories = state.expenseCategories.filter(
            (category) => category.id !== id,
          );
        }),
      setLoading: (isLoading: boolean) =>
        set((state) => {
          state.isLoading = isLoading;
        }),
      setError: (error: Error | null) =>
        set((state) => {
          state.error = error;
        }),
    })),
  ),
);
