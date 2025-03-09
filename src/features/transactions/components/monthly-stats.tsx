import { StatCard } from '@/components/shared/stat-card';
import { CircleArrowDown, CircleArrowUp, CircleDollarSign } from 'lucide-react';
import { TypeTotals } from '../types';
import { Separator } from '@/components/ui/separator';

type Props = {
  monthlyStats: TypeTotals;
};
export const MonthlyStats = ({ monthlyStats }: Props) => {
  return (
    <div className="bg-white border dark:bg-zinc-800 rounded-2xl p-3 shadow-sm">
      <div className="grid grid-flow-col gap-2">
        <StatCard
          icon={CircleArrowUp}
          value={monthlyStats.income}
          label="Income"
          iconClass="text-green-500 rotate-45"
        />
        <Separator orientation="vertical" />
        <StatCard
          icon={CircleArrowDown}
          value={monthlyStats.expense}
          label="Expense"
          iconClass="text-red-500 rotate-45"
        />
        <Separator orientation="vertical" />
        <StatCard
          icon={CircleDollarSign}
          value={monthlyStats.income - monthlyStats.expense}
          label="Total"
          iconClass="text-zinc-500 dark:text-zinc-200"
        />
      </div>
    </div>
  );
};
