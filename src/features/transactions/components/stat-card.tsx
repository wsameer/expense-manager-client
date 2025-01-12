import { LucideIcon } from 'lucide-react';
import { CAD } from '@/lib/constants';

type Props = {
  label: string;
  value: number;
  iconClass?: string;
  icon?: LucideIcon;
};

export const StatCard = ({ label, value, iconClass, icon: Icon }: Props) => {
  return (
    <div className="flex items-center gap-2">
      {Icon && <Icon className={`h-5 w-5 ${iconClass}`} />}
      <div className="flex-1 space-y-1.5">
        <p
          className="font-medium leading-none"
          style={{ fontSize: '11px' }}
        >
          {label}
        </p>
        <p className="text-xs font-mono">{CAD.format(value)}</p>
      </div>
    </div>
  );
};
