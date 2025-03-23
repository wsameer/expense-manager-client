import React, { forwardRef } from 'react';
import { Plus } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Account } from '@/store/accountsStore';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { SelectorOption } from './types';

type Props = {
  options: SelectorOption[];
  onSelect: (value: Account) => void;
  createOptionCallback?: () => void;
  className?: string;
};

export const OptionSelector = React.memo(
  forwardRef<HTMLDivElement, Props>(
    ({ options, onSelect, createOptionCallback, className }, ref) => {
      const filledOptions =
        options.length < 9
          ? [...options, ...Array(9 - options.length).fill(null)]
          : [...options, null];

      return (
        <ScrollArea
          ref={ref}
          className={className}
        >
          <div className="grid grid-cols-3 gap-2 p-1">
            {filledOptions.map((option, index) => {
              const isCreateButton =
                option === null &&
                index === options.length &&
                createOptionCallback;

              return (
                <Button
                  key={option ? option.id : `empty-${index}`}
                  className={cn(
                    'px-2 h-14 rounded-xl whitespace-normal text-center leading-3',
                    {
                      'bg-zinc-200': !option && !isCreateButton,
                      'bg-background': isCreateButton,
                    },
                  )}
                  variant="outline"
                  size="lg"
                  style={{ fontSize: '11px' }}
                  onClick={(e) => {
                    e.preventDefault();
                    if (isCreateButton && createOptionCallback) {
                      createOptionCallback();
                    } else if (option) {
                      onSelect(option);
                    }
                  }}
                  disabled={!option && !isCreateButton}
                >
                  {isCreateButton ? (
                    <>
                      <Plus size={14} />
                      <span>Create</span>
                    </>
                  ) : (
                    option?.name || ''
                  )}
                </Button>
              );
            })}
          </div>
        </ScrollArea>
      );
    },
  ),
);

OptionSelector.displayName = 'OptionSelector';
