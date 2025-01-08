import React, { memo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const Busy = memo(() => {
  return (
    <div className="flex flex-col w-full gap-4">
      <Skeleton className="h-[42px] w-full rounded-xl" />
      <Skeleton className="h-[42px] w-full rounded-xl" />
      <Skeleton className="h-[42px] w-full rounded-xl" />
      <Skeleton className="h-[42px] w-full rounded-xl" />
      <Skeleton className="h-[42px] w-full rounded-xl" />
      <Skeleton className="h-[42px] w-full rounded-xl" />
      <Skeleton className="h-[42px] w-full rounded-xl" />
      <Skeleton className="h-[42px] w-full rounded-xl" />
      <Skeleton className="h-[42px] w-full rounded-xl" />
    </div>
  );
});

Busy.displayName = 'Busy';
