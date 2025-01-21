import { Account } from '@/types/api';
import { Category } from '../expense-category/types';
import { IncomeCategory } from '../income-category/types';
import { TransactionType } from '@/types';

export const ACCOUNTS = [
  { label: 'Chequing', value: 'chequing' },
  { label: 'Savings', value: 'savings' },
  { label: 'Credit Card', value: 'credit_card' },
  { label: 'Cash', value: 'cash' },
];

export type CreateTransactionPayload = {
  type: TransactionType;
  date: string;
  amount: number;
  fromAccountId: number;
  toAccountId?: number;
  expenseCategoryId?: number;
  incomeCategoryId?: number;
  expenseSubcategoryId?: number | null;
  note?: string;
};

export interface Transaction {
  id: number;
  user_id: number;
  type: TransactionType;
  date: string;
  amount: number;
  fromAccountId: number;
  toAccountId: number | null;
  expenseCategoryId: number | null;
  expenseSubcategoryId: number | null;
  incomeCategoryId: number | null;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  fromAccount: Account;
  toAccount: Account | null;
  expenseCategory: Category | null;
  expenseSubcategory: Category | null;
  incomeCategory: IncomeCategory | null;
}

export interface TypeTotals {
  [TransactionType.INCOME]: number;
  [TransactionType.EXPENSE]: number;
}
