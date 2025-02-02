import React from 'react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

type Props = {
  icon: React.ReactElement;
  isActive: boolean;
  label: string;
  onClick: () => void;
};

export const NavigationButton = ({ icon, isActive, label, onClick }: Props) => {
  return (
    <Button
      className={cn(
        'relative flex h-[42px] w-[42px] items-center justify-center rounded-full text-background dark:text-foreground opacity-50 hover:opacity-100',
        {
          'opacity-100 text-foreground': isActive,
        },
      )}
      variant="link"
      onClick={onClick}
      size="icon"
    >
      <div
        className={`absolute inset-0 rounded-full bg-white dark:bg-gunmetal-800 transition-opacity ${
          isActive ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <span className="relative">
        {React.cloneElement(icon, {
          className: isActive ? 'bg-gunmetal-800' : '',
        })}
      </span>
      <span className="sr-only">{label}</span>
    </Button>
  );
};
