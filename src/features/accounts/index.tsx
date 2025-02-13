import React from 'react';
import { TrendingDown, TrendingUp, DollarSign } from 'lucide-react';

import { useResponsive } from '@/hooks';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

import { AccountOverviewStat } from './components/account-overview-stat';
import { AccountGroups } from './components/account-groups';
import { QueryKey } from './types';

const statsData = [
  {
    id: 1,
    label: 'Assets',
    queryKey: 'asset' as QueryKey,
    icon: TrendingUp,
  },
  {
    id: 2,
    label: 'Liabilities',
    queryKey: 'debt' as QueryKey,
    icon: TrendingDown,
  },
  {
    id: 3,
    label: 'Available',
    queryKey: 'total' as QueryKey,
    icon: DollarSign,
  },
];

export const AccountsPage = () => {
  const { isDesktop } = useResponsive();

  return (
    <div
      className={cn('grid grid-cols-1 gap-6', {
        'w-1/3': isDesktop,
      })}
    >
      <div className="bg-white border dark:bg-zinc-800 rounded-2xl px-2 py-3 shadow-sm">
        <div className="grid grid-flow-col gap-2">
          {statsData.map((item, index) => (
            <React.Fragment key={item.id}>
              <AccountOverviewStat {...item} />
              {index < statsData.length - 1 && (
                <Separator orientation="vertical" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      <AccountGroups />
    </div>
  );
};
