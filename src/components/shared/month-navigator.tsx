import { memo, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MonthSelector } from './month-selector';
import { cn, getFullMonthAndDate } from '@/lib/utils';

type MonthNavigatorProps = {
  currentDate: Date;
  handleMonthChange: (year: number, month: number) => void;
  options?: {
    timeJump?: boolean;
  };
  className?: string;
};

export const MonthNavigator = memo<MonthNavigatorProps>(
  ({ currentDate, handleMonthChange, options, className }) => {
    const [monthSelectorOpen, setMonthSelectorOpen] = useState(false);

    const handleMonthSelect = (year: number, month: number) => {
      setMonthSelectorOpen(false);
      return handleMonthChange(year, month);
    };

    const handlePreviousMonth = () => {
      let year = currentDate.getFullYear();
      let month = currentDate.getMonth() - 1;
      if (month < 0) {
        month = 11;
        year = year - 1;
      }
      return handleMonthChange(year, month);
    };

    const handleNextMonth = () => {
      let year = currentDate.getFullYear();
      let month = currentDate.getMonth() + 1;

      if (month === 12) {
        month = 0;
        year += 1;
      }

      return handleMonthChange(year, month);
    };

    return (
      <div className={cn('flex items-center px-1 w-full', className)}>
        <Button
          className="rounded-xl h-8 w-8 dark:hover:bg-background/40"
          onClick={handlePreviousMonth}
          variant="ghost"
          size="icon"
        >
          <ChevronLeft size={20} />
        </Button>
        {options?.timeJump ? (
          <Popover
            open={monthSelectorOpen}
            onOpenChange={setMonthSelectorOpen}
          >
            <PopoverTrigger className="flex items-center gap-1 font-bold">
              <Calendar className="h-3.5 w-3.5" />
              <p className="leading-7 text-sm">
                {getFullMonthAndDate(currentDate, 'short')}
              </p>
            </PopoverTrigger>
            <PopoverContent>
              <MonthSelector
                currentDate={currentDate}
                onSelectMonth={handleMonthSelect}
              />
            </PopoverContent>
          </Popover>
        ) : (
          <p className="text-l font-bold">
            {getFullMonthAndDate(currentDate, 'long')}
          </p>
        )}
        <Button
          className="rounded-xl h-8 w-8 dark:hover:bg-background/40"
          onClick={handleNextMonth}
          variant="ghost"
          size="icon"
        >
          <ChevronRight size={20} />
        </Button>
      </div>
    );
  },
);
