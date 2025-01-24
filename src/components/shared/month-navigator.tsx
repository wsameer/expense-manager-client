import { memo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MonthSelector } from './month-selector';
import { getFullMonthAndDate } from '@/lib/utils';

type MonthNavigatorProps = {
  currentDate: Date;
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
