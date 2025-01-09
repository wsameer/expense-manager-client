import { INCOME_CATEGORIES_API } from '@/features/income-category/constants';
import { EXPENSE_CATEGORIES_API } from '@/features/expense-category/constants';

export const COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--chart-6)',
  'var(--chart-7)',
  'var(--chart-9)',
  'var(--chart-8)',
];

export const EXPENSE_TOTALS_API = EXPENSE_CATEGORIES_API + '/totals';
export const INCOME_TOTALS_API = INCOME_CATEGORIES_API + '/totals';
