import { LucideIcon } from 'lucide-react';
import { CAD } from '@/lib/constants';
import { Skeleton } from '../ui/skeleton';

type Props = {
  label: string;
  value: number;
  iconClass?: string;
  icon?: LucideIcon;
  isLoading?: boolean;
};

export const StatCard = ({
  label,
  value,
  iconClass,
  icon: Icon,
  isLoading,
}: Props) => {
  return (
    <div className="flex items-center gap-2">
      {Icon && <Icon className={`h-4 w-4 ${iconClass}`} />}
      <div className="flex-1 space-y-1.5">
        {isLoading ? (
          <Skeleton className="h-3 w-8 rounded-full" />
        ) : (
          <p className="font-medium text-xs text-foreground/60 leading-none">
            {label}
          </p>
        )}
        {isLoading ? (
          <Skeleton className="h-4 w-14 rounded-full" />
        ) : (
          <p className="text-sm">{CAD.format(value)}</p>
        )}
      </div>
    </div>
  );
};
