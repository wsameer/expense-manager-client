import React from 'react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { Account } from '@/types/api';
import { SelectorOption } from './types';

type Props = {
  options: SelectorOption[];
  onSelect: (value: Account) => void;
};

export const OptionSelector = React.memo<Props>(({ options, onSelect }) => {
  const filledOptions =
    options.length < 9
      ? [...options, ...Array(9 - options.length).fill(null)]
      : options;

  return (
    <div className="grid grid-cols-3 gap-1">
      {filledOptions.map((option, index) => (
        <Button
          key={option ? option.id : `empty-${index}`}
          className={cn('px-2 h-14 whitespace-normal text-center leading-3', {
            'bg-zinc-200': !option,
          })}
          variant="outline"
          size="lg"
          style={{ fontSize: '11px' }}
          onClick={(e) => {
            e.preventDefault();
            if (option) onSelect(option);
          }}
          disabled={!option}
        >
          {option ? option.name : ''}
        </Button>
      ))}
    </div>
  );
});

OptionSelector.displayName = 'OptionSelector';
