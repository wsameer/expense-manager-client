import { useState } from 'react';
import { PageLayout } from '@/components/layout/page-layout';
import { useUiStore } from '@/store/uiStore';
import { TransactionList } from '@/features/transactions/transaction-list';
import { MonthNavigator } from '@/components/shared/month-navigator';
import { cn } from '@/lib/utils';
import { useResponsive } from '@/hooks/use-responsive';
import { getMonthsToDisplay } from './utils';
import { MonthsCarousel } from './component/months-carousel';

export type MonthData = {
  month: number;
  year: number;
};

export const TransactionsPage = () => {
  const { isDesktop } = useResponsive();
  const { selectedDate, setSelectedDate } = useUiStore();
  const [displayedMonths, setDisplayedMonths] = useState(() =>
    getMonthsToDisplay(selectedDate),
  );

  const handleMonthSelect = (year: number, month: number) => {
    setSelectedDate(new Date(year, month));
    setDisplayedMonths(() => getMonthsToDisplay(selectedDate));
  };

  return (
    <PageLayout
      title="Transactions"
      rightElement={
        <div className="flex-none flex justify-end overflow-hidden whitespace-nowrap bg-white border shadow-sm dark:bg-zinc-800 rounded-xl py-1">
          <MonthNavigator
            handleMonthChange={handleMonthSelect}
            currentDate={selectedDate}
            className="px-3"
            suppressNavigators
          />
        </div>
      }
    >
      <div
        className={cn('grid grid-cols-1 gap-4', {
          'w-2/5': isDesktop,
        })}
      >
        <MonthsCarousel
          setDisplayedMonths={setDisplayedMonths}
          displayedMonths={displayedMonths}
        />

        <TransactionList />
      </div>
    </PageLayout>
  );
};
