import { TransactionType } from '@/types';
import { Transaction, TypeTotals } from './types';

/**
 * This function takes a JavaScript Date object and
 * converts it into a string in "YYYY-MM-DD" format.
 * @param date JavaScript Date object
 * @returns "2024-01-20"
 */
const getDateKey = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

export const groupTransactionsByDate = (
  transactions: Transaction[],
): Record<string, Transaction[]> => {
  return transactions.reduce(
    (acc, transaction) => {
      const date = new Date(transaction.date);
      const dateKey = getDateKey(date);
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(transaction);
      return acc;
    },
    {} as Record<string, Transaction[]>,
  );
};

export const calculateTotalsByType = (
  transactions: Transaction[],
): TypeTotals => {
  const initialTotals: TypeTotals = {
    [TransactionType.INCOME]: 0,
    [TransactionType.EXPENSE]: 0,
  };

  return transactions.reduce((acc, { type, amount }) => {
    // @ts-expect-error just
    acc[type] += amount;
    return acc;
  }, initialTotals);
};
