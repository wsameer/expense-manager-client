import { TransactionType } from '@/types';
import { create } from 'zustand';
import { combine, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type State = {
  selectedDate: Date;
  selectedTransactionType: TransactionType;
};

type Actions = {
  setSelectedDate: (date: Date) => void;
  setSelectedTransactionType: (type: TransactionType) => void;
};

const initialState = {
  selectedDate: new Date(),
  selectedTransactionType: TransactionType.EXPENSE,
};

export const useUiStore = create<State & Actions>()(
  devtools(
    immer(
      combine(initialState, (set) => ({
        setSelectedDate: (date: Date) =>
          set((state) => {
            state.selectedDate = date;
          }),
        setSelectedTransactionType: (type: TransactionType) =>
          set((state) => {
            state.selectedTransactionType = type;
          }),
      })),
    ),
  ),
);
