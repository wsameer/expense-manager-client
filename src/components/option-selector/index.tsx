import React from 'react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { Account } from '@/types/api';
import { SelectorOption } from './types';
import { ScrollArea } from '../ui/scroll-area';
import { Plus } from 'lucide-react';

type Props = {
  options: SelectorOption[];
  onSelect: (value: Account) => void;
  createOptionCallback?: () => void;
};

export const OptionSelector = React.memo<Props>(
  ({ options, onSelect, createOptionCallback }) => {
    const filledOptions =
      options.length < 9
        ? [...options, ...Array(9 - options.length).fill(null)]
        : [...options, null];

    return (
      <ScrollArea>
        <div className="grid grid-cols-3 gap-1">
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
);

OptionSelector.displayName = 'OptionSelector';
