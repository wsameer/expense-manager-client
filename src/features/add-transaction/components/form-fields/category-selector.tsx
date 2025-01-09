import React, { useState } from 'react';

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { FormControl } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Props = {
  selected: string;
  onSelect: (value: string) => void;
  setShowAccountSelector: (value: boolean) => void;
  options: Array<{
    id: number;
    value: string;
    label: string;
  }>;
};

export const CategorySelector = React.memo<Props>(
  ({ selected, onSelect, options, setShowAccountSelector }) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    return (
      <Popover
        open={isPopoverOpen}
        onOpenChange={(open) => {
          setShowAccountSelector(false);
          setIsPopoverOpen(open);
        }}
      >
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                'w-3/4 justify-between',
                !selected && 'text-muted-foreground',
              )}
            >
              {selected
                ? options.find((category) => category.value === selected)?.label
                : 'Select category'}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-max p-0">
          <Command>
            <CommandInput
              className="border-none"
              placeholder="Search category..."
            />
            <CommandList>
              <CommandEmpty>No category found.</CommandEmpty>
              <CommandGroup>
                {options.map((category) => (
                  <CommandItem
                    value={category.label}
                    key={category.value}
                    onSelect={() => {
                      onSelect(category.value);
                      setIsPopoverOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        category.value === selected
                          ? 'opacity-100'
                          : 'opacity-0',
                      )}
                    />
                    {category.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  },
);

CategorySelector.displayName = 'CategorySelector';
