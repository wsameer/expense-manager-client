import React, { useState } from 'react';
import { useResponsive } from '@/hooks';
import { cn } from '@/lib/utils';
import { MonthNavigator } from '@/components/shared/month-navigator';

export const TransactionsPage = () => {
  const { isDesktop } = useResponsive();
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleMonthChange = (year: number, month: number) => {
    setCurrentDate(new Date(year, month));
  };

  return (
    <div
      className={cn('grid grid-cols-1 gap-3', {
        'w-1/3': isDesktop,
      })}
    >
      <MonthNavigator
        currentDate={currentDate}
        handleMonthChange={handleMonthChange}
      />
      {/* <TransactionList currentDate={currentDate} /> */}
    </div>
  );
};
