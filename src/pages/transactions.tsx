import { useState } from 'react';
import { PageLayout } from '@/components/layout';
import { useResponsive } from '@/hooks';
import { cn } from '@/lib/utils';
import { MonthNavigator } from '@/components/shared/month-navigator';
import { TransactionList } from '@/features/transactions/components/transaction-list';
import { DateTime } from 'luxon';

export const TransactionsRoute = () => {
  const [currentDate, setCurrentDate] = useState<DateTime>(DateTime.now());
  const { isDesktop } = useResponsive();

  const handleMonthChange = (year: number, month: number) => {
    setCurrentDate(DateTime.fromObject({ year, month }));
  };

  return (
    <PageLayout title="Transactions">
      <div
        className={cn('grid grid-cols-1 gap-3', {
          'w-1/3': isDesktop,
        })}
      >
        <MonthNavigator
          currentDate={currentDate}
          handleMonthChange={handleMonthChange}
        />

        <TransactionList currentDate={currentDate} />
      </div>
    </PageLayout>
  );
};
