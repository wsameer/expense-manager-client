import { Skeleton } from '@/components/ui/skeleton';

export const SkeletonLoader = () => (
  <div>
    <Skeleton className="h-[24px] w-[150px] rounded-xl" />
    <Skeleton className="mt-2 h-[96px] w-full rounded-xl" />
  </div>
);
