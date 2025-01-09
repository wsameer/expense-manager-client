import { TransactionType } from '@/types';

export type PieChartData = {
  id: number;
  category: TransactionType;
  totalAmount: number;
};
