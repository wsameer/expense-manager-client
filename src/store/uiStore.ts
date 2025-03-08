import { create } from 'zustand';
import { combine, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type State = {
  selectedDate: Date;
};

type Actions = {
  setSelectedDate: (date: Date) => void;
};

const initialState = {
  selectedDate: new Date(),
};

export const useUiStore = create<State & Actions>()(
  devtools(
    immer(
      combine(initialState, (set) => ({
        setSelectedDate: (date: Date) =>
          set((state) => {
            state.selectedDate = date;
          }),
      })),
    ),
  ),
);
