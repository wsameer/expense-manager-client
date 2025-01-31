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
        'relative flex h-[42px] w-[42px] items-center justify-center rounded-full text-zinc-400 hover:text-zinc-100',
        {
          'text-zinc-900 hover:text-zinc-900': isActive,
        },
      )}
      variant="link"
      onClick={onClick}
    >
      <div
        className={`absolute inset-0 rounded-full bg-white transition-opacity ${
          isActive ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <span className="relative">{icon}</span>
      <span className="sr-only">{label}</span>
    </Button>
  );
};
