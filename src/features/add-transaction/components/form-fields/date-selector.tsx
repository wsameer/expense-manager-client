import React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { FormControl } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type DateSelectorProps = {
  selected: Date | undefined;
  onSelect: (selected: Date) => void | undefined;
  closeOtherControls: () => void;
};

export const DateSelector = React.memo(
  ({ selected, onSelect, closeOtherControls }: DateSelectorProps) => {
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

    const handleOnSelect = (date: Date | undefined) => {
      if (!date) return;
      onSelect(date);
      setIsPopoverOpen(false);
    };

    return (
      <Popover
        open={isPopoverOpen}
        onOpenChange={(open) => {
          closeOtherControls();
          setIsPopoverOpen(open);
        }}
      >
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant={'outline'}
              className={cn(
                'w-3/4 text-left font-normal',
                !selected && 'text-muted-foreground',
              )}
            >
              {selected ? format(selected, 'PPP') : <span>Pick a date</span>}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align="start"
        >
          <Calendar
            mode="single"
            selected={selected}
            onSelect={handleOnSelect}
            initialFocus
            required
          />
        </PopoverContent>
      </Popover>
    );
  },
);

DateSelector.displayName = 'DateSelector';
