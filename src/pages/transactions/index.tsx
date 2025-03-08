import { useState } from 'react';
import { PageLayout } from '@/components/layout/page-layout';
import { useResponsive } from '@/hooks';
import { useUiStore } from '@/store/uiStore';
import { cn } from '@/lib/utils';
import { TransactionList } from '@/features/transactions/components/transaction-list';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MONTH_RANGE } from './constant';
import { MonthButton } from './component/month-button';
import { MonthPicker } from './component/month-picker';

export type MonthData = {
  month: number;
  year: number;
};

// Helper functions
const getMonthsToDisplay = (date: Date): MonthData[] => {
  const currentMonth = date.getMonth();
  const currentYear = date.getFullYear();

  return MONTH_RANGE.map((offset) => {
    const month = (currentMonth + offset + 12) % 12;
    const year = currentYear + Math.floor((currentMonth + offset) / 12);
    return { month, year };
  });
};

export const TransactionsRoute = () => {
  const { isDesktop } = useResponsive();
  const { selectedDate, setSelectedDate } = useUiStore();
  const [displayedMonths, setDisplayedMonths] = useState(() =>
    getMonthsToDisplay(selectedDate),
  );
  const [centerMonth, setCenterMonth] = useState(() => {
    return { month: selectedDate.getMonth(), year: selectedDate.getFullYear() };
  });

  const handleMonthSelect = (year: number, month: number) => {
    setSelectedDate(new Date(year, month));
    setDisplayedMonths(() => getMonthsToDisplay(selectedDate));
  };

  const handleMonthButtonClick = (year: number, month: number) => {
    setSelectedDate(new Date(year, month));
  };

  const handleMonthNavigation = (direction: number) => {
    const newCenterMonth = new Date(
      centerMonth.year,
      centerMonth.month + direction,
    );
    setCenterMonth({
      month: newCenterMonth.getMonth(),
      year: newCenterMonth.getFullYear(),
    });
    setDisplayedMonths(getMonthsToDisplay(newCenterMonth));
  };

  return (
    <PageLayout title="Transactions">
      <div
        className={cn('grid grid-cols-1 gap-4', {
          'w-3/5': isDesktop,
        })}
      >
        <div className="md:hidden flex items-end justify-between gap-4 mb-2">
          <h2 className="text-3xl font-normal text-foreground tracking-tight">
            Transactions
          </h2>
          <div className="flex-none flex justify-end overflow-hidden whitespace-nowrap bg-white border shadow-sm dark:bg-zinc-800 rounded-2xl py-0.5">
            <MonthPicker
              onMonthSelect={handleMonthSelect}
              currentDate={selectedDate}
              className="justify-center gap-1"
            />
          </div>
        </div>

        <div className="flex gap-1 items-center">
          <Button
            className="rounded-xl h-6 w-6 dark:hover:bg-background/40"
            onClick={() => handleMonthNavigation(-1)}
            variant="ghost"
            size="icon"
          >
            <ChevronLeft className="cursor-pointer" />
          </Button>

          <div className="flex-1 overflow-hidden">
            <div className="grid grid-cols-7 gap-1.5 items-center">
              {displayedMonths.map((monthData) => (
                <MonthButton
                  key={`${monthData.year}-${monthData.month}`}
                  monthData={monthData}
                  isSelected={
                    monthData.month === selectedDate.getMonth() &&
                    monthData.year === selectedDate.getFullYear()
                  }
                  onSelect={handleMonthButtonClick}
                />
              ))}
            </div>
          </div>

          <Button
            className="rounded-xl h-6 w-6 dark:hover:bg-background/40"
            onClick={() => handleMonthNavigation(1)}
            variant="ghost"
            size="icon"
          >
            <ChevronRight className="cursor-pointer" />
          </Button>
        </div>

        <TransactionList />
      </div>
    </PageLayout>
  );
};
