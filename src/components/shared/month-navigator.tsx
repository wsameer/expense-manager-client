import { memo, useState } from 'react';
import {
  CalendarArrowDown,
  CalendarArrowUp,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
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

    // const renderLongVariant = () => (
    //   <div className="grid grid-cols-7 gap-1 items-center">
    //     <div className="flex flex-col space-y-1 py-2.5 px-1">
    //       <p className="text-sm text-center text-foreground font-medium">Dec</p>
    //       <p className="text-xs text-center text-muted-foreground">2024</p>
    //     </div>

    //     <div className="flex flex-col space-y-1 py-2.5 px-1">
    //       <p className="text-sm text-center text-foreground font-medium">Jan</p>
    //       <p className="text-xs text-center text-muted-foreground">2025</p>
    //     </div>

    //     <div className="flex flex-col space-y-1 py-2.5 px-1 bg-zinc-600 rounded-3xl">
    //       <p className="text-sm text-center text-foreground font-medium">Feb</p>
    //       <p className="text-xs text-center text-muted-foreground">2025</p>
    //     </div>

    //     <div className="flex flex-col space-y-1 py-2.5 px-1">
    //       <p className="text-sm text-center text-foreground font-medium">Mar</p>
    //       <p className="text-xs text-center text-muted-foreground">2025</p>
    //     </div>

    //     <div className="flex flex-col space-y-1 py-2.5 px-1">
    //       <p className="text-sm text-center text-foreground font-medium">Apr</p>
    //       <p className="text-xs text-center text-muted-foreground">2025</p>
    //     </div>

    //     <div className="flex flex-col space-y-1 py-2.5 px-1">
    //       <p className="text-sm text-center text-foreground font-medium">May</p>
    //       <p className="text-xs text-center text-muted-foreground">2025</p>
    //     </div>

    //     <div className="flex flex-col space-y-1 py-2.5 px-1">
    //       <p className="text-sm text-center text-foreground font-medium">Jun</p>
    //       <p className="text-xs text-center text-muted-foreground">2025</p>
    //     </div>
    //   </div>
    // );

    return (
      <div className="grid grid-flow-row auto-rows-max">
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
                <div className="flex gap-1 items-center p-2">
                  {monthSelectorOpen ? (
                    <CalendarArrowUp className="h-4 w-4" />
                  ) : (
                    <CalendarArrowDown className="h-4 w-4" />
                  )}
                  <span className="font-light text-lg">
                    {currentDate.toLocaleDateString('en-CA', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
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
              {getFullMonthAndDate(currentDate)}
            </p>
          )}
          <Button
            className="p-0"
            onClick={handleNextMonth}
            variant={'ghost'}
          >
            <ChevronRight size={20} />
          </Button>
        </div>
      </div>
    );
  },
);
