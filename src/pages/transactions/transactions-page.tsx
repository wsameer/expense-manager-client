import { useState } from 'react';
import { PageLayout } from '@/components/layout/page-layout';
import { useUiStore } from '@/store/uiStore';
import { TransactionList } from '@/features/transactions/transaction-list';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MonthButton } from './component/month-button';
import { getMonthsToDisplay } from './utils';
import { MonthNavigator } from '@/components/shared/month-navigator';

export type MonthData = {
  month: number;
  year: number;
};

export const TransactionsPage = () => {
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
      <div className="grid grid-cols-1 gap-4 md:w-1/3">
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
