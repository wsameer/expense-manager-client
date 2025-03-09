import { MonthSelector } from '@/components/shared/month-selector';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn, getFullMonthAndDate } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';

type Props = {
  currentDate: Date;
  onMonthSelect: (year: number, month: number) => void;
  className?: string;
};

export const MonthPicker = ({
  currentDate,
  onMonthSelect,
  className,
}: Props) => {
  const [monthSelectorOpen, setMonthSelectorOpen] = useState(false);

  const handleMonthSelect = (year: number, month: number) => {
    setMonthSelectorOpen(false);
    return onMonthSelect(year, month);
  };

  return (
    <div
      id="month-navigator"
      className={cn('flex items-center px-4 w-full', className)}
    >
      {
        <Popover
          open={monthSelectorOpen}
          onOpenChange={setMonthSelectorOpen}
        >
          <PopoverTrigger className="flex items-center gap-1 font-bold">
            <CalendarIcon className="h-3.5 w-3.5" />
            <p className="leading-7 text-sm">
              {getFullMonthAndDate(currentDate, 'short')}
            </p>
          </PopoverTrigger>
          <PopoverContent
            sideOffset={10}
            collisionPadding={{ right: 16 }}
          >
            <MonthSelector
              currentDate={currentDate}
              onSelectMonth={handleMonthSelect}
            />
          </PopoverContent>
        </Popover>
      }
    </div>
  );
};
