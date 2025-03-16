import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { MonthButton } from './month-button';
import { MonthData } from '../transactions-page';
import { useUiStore } from '@/store/uiStore';
import { getMonthsToDisplay } from '../utils';

type Props = {
  displayedMonths: MonthData[];
  setDisplayedMonths: (months: MonthData[]) => void;
};

export const MonthsCarousel = ({
  displayedMonths,
  setDisplayedMonths,
}: Props) => {
  const { selectedDate, setSelectedDate } = useUiStore();

  const [centerMonth, setCenterMonth] = React.useState(() => {
    return { month: selectedDate.getMonth(), year: selectedDate.getFullYear() };
  });

  const handleMonthButtonClick = React.useCallback(
    (year: number, month: number) => {
      setSelectedDate(new Date(year, month));
    },
    [setSelectedDate],
  );

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
              onClickHandler={handleMonthButtonClick}
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
  );
};
