import { DollarSign, TrendingDown, TrendingUp } from 'lucide-react';
import React from 'react';
import { PageLayout } from '@/components/layout/page-layout';
import { Separator } from '@/components/ui/separator';
import { AccountGroups } from '@/features/accounts/components/account-groups';
import { FinancialStat } from '@/features/accounts/components/financial-stat';
import { QueryKey } from '@/features/accounts/types';

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
  return (
    <PageLayout
      title="Accounts"
      subTitle="Your accounts with its latest balance"
    >
      <div className="grid grid-cols-1 gap-3 md:w-1/3">
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
