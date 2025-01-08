import { Transaction } from '@/features/transactions/types';

export type FormProps = {
  setOpen: (value: boolean) => void;
  existingData?: Transaction;
};
