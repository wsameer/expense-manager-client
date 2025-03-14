import { PageLayout } from '@/components/layout/page-layout';
import { Separator } from '@/components/ui/separator';
import { AccountGroups } from '@/features/accounts/components/account-groups';
import { FinancialStat } from '@/features/accounts/components/financial-stat';
import { QueryKey } from '@/features/accounts/types';
import { useResponsive } from '@/hooks/use-responsive';
import { cn } from '@/lib/utils';
import { DollarSign, TrendingDown, TrendingUp } from 'lucide-react';
import React from 'react';

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
    <PageLayout
      title="Accounts"
      subTitle="Your accounts with its latest balance"
    >
      <div
        className={cn('grid grid-cols-1 gap-3', {
          'w-3/5': isDesktop,
        })}
      >
        <div className="bg-white border dark:bg-zinc-800 rounded-2xl h-16 py-3 shadow-sm">
          <div className="flex flex-row justify-evenly items-center h-full gap-1">
            {statsData.map((item, index) => (
              <React.Fragment key={item.id}>
                <FinancialStat {...item} />
                {index < statsData.length - 1 && (
                  <Separator orientation="vertical" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        <AccountGroups />
      </div>
    </PageLayout>
  );
};
