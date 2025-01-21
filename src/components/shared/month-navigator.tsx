import { memo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MonthSelector } from './month-selector';
import { getFullMonthAndDate } from '@/lib/utils';
import { DateTime } from 'luxon';

type MonthNavigatorProps = {
  currentDate: DateTime;
  handleMonthChange: (year: number, month: number) => void;
  options?: {
    timeJump?: boolean;
  };
};

export const MonthNavigator = memo<MonthNavigatorProps>(
  ({ currentDate, handleMonthChange, options }) => {
    const [monthSelectorOpen, setMonthSelectorOpen] = useState(false);

    const handleMonthSelect = (year: number, month: number) => {
      setMonthSelectorOpen(false);
      return handleMonthChange(year, month);
    };

    const handlePreviousMonth = () => {
      let currentYear = currentDate.year;
      let currentMonth = currentDate.month - 1;
      if (currentMonth === 0) {
        currentMonth = 12;
        currentYear -= 1;
      }
      return handleMonthChange(currentYear, currentMonth);
    };

    const handleNextMonth = () => {
      let currentYear = currentDate.year;
      let currentMonth = currentDate.month + 1;
      if (currentMonth === 13) {
        currentMonth = 1;
        currentYear = currentYear + 1;
      }

      return handleMonthChange(currentYear, currentMonth);
    };

    return (
      <div className="flex items-center justify-between">
        <Button
          className="p-0"
          onClick={handlePreviousMonth}
          variant={'ghost'}
        >
          <ChevronLeft size={20} />
        </Button>
        {options?.timeJump ? (
          <Popover
            open={monthSelectorOpen}
            onOpenChange={setMonthSelectorOpen}
          >
            <PopoverTrigger className="font-bold">
              {getFullMonthAndDate(currentDate)}
            </PopoverTrigger>
            <PopoverContent>
              <MonthSelector
                currentDate={currentDate}
                onSelectMonth={handleMonthSelect}
              />
            </PopoverContent>
          </Popover>
        ) : (
          <p className="text-l font-bold">{getFullMonthAndDate(currentDate)}</p>
        )}
        <Button
          className="p-0"
          onClick={handleNextMonth}
          variant={'ghost'}
        >
          <ChevronRight size={20} />
        </Button>
      </div>
    );
  },
);
