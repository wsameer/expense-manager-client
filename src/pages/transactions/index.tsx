import { useState } from 'react';
import { PageLayout } from '@/components/layout/page-layout';
import { useResponsive } from '@/hooks';
import { cn } from '@/lib/utils';
import { MonthNavigator } from '@/components/shared/month-navigator';
import { TransactionList } from '@/features/transactions/components/transaction-list';

export const TransactionsRoute = () => {
  const { isDesktop } = useResponsive();
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleMonthChange = (year: number, month: number) => {
    setCurrentDate(new Date(year, month));
  };

  return (
    <PageLayout title="Transactions">
      <div
        className={cn('grid grid-cols-1 gap-3', {
          'w-3/5': isDesktop,
        })}
      >
        <div className="flex-[1] flex flex-col min-w-0">
          <h2 className="text-3xl font-normal text-foreground tracking-tight">
            Transactions
          </h2>
        </div>
        <MonthNavigator
          currentDate={currentDate}
          handleMonthChange={handleMonthChange}
        />
        <TransactionList currentDate={currentDate} />
      </div>
    </PageLayout>
  );
};
