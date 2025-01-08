import { Transaction } from './types';

export const getFullMonthAndDate = (date: Date): string => {
  return date.toLocaleDateString('en-CA', { month: 'long', year: 'numeric' });
};

export const parseDate = (dateString: string): Date => {
  const [datePart, timePart] = dateString.split(' ');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hours, minutes, seconds] = timePart.split(':').map(Number);
  return new Date(year, month - 1, day, hours, minutes, seconds);
};

export const getDateKey = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

export const groupTransactionsByDate = (
  transactions: Transaction[],
): Record<string, Transaction[]> => {
  return transactions.reduce(
    (acc, transaction) => {
      const date = parseDate(transaction.date);
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
