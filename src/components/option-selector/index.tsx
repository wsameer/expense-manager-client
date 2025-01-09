import React from 'react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

interface Option {
  id: number;
  name: string;
}

type Props = {
  options: Option[];
  onSelect: (value: any) => void;
};

export const OptionSelector = React.memo<Props>(({ options, onSelect }) => {
  // Ensure we always have 9 slots (3 rows x 3 columns)
  const filledOptions = [...options, ...Array(9).fill(null)].slice(0, 9);

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
