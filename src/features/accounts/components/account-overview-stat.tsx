import React, { useMemo } from 'react';
import { LucideIcon } from 'lucide-react';

import useSWR from 'swr';
import { ACCOUNTS_STATS_API } from '../constants';
import axiosInstance from '@/lib/api-client';
import { QueryKey } from '../types';
import { CAD } from '@/lib/constants';
import { Skeleton } from '@/components/ui/skeleton';

type Props = {
  label: string;
  queryKey: QueryKey;
  icon: LucideIcon;
};

type ApiResponse = { statType: string; totalBalance: number };

export const AccountOverviewStat = React.memo(
  ({ label, queryKey, icon: Icon }: Props) => {
    const { data, isLoading } = useSWR(
      ACCOUNTS_STATS_API + queryKey,
      async () => {
        const res = await axiosInstance.get<ApiResponse>(ACCOUNTS_STATS_API, {
          params: { type: queryKey },
        });
        return res.data;
      },
      {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
      },
    );

    const formattedBalance = useMemo(() => {
      if (data?.totalBalance != null) {
        return CAD.format(data.totalBalance);
      }
      return '';
    }, [data?.totalBalance]);

    const labelColor = useMemo(() => {
      if (queryKey === 'debt') return 'text-red-600';
      if (queryKey === 'asset') return 'text-green-600';
      if (queryKey === 'total') return 'text-green-600';
      return '';
    }, [queryKey]);

    return (
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${labelColor}`} />
        <div className="flex-1 space-y-1.5">
          {isLoading ? (
            <Skeleton className="h-3 w-8 rounded-full" />
          ) : (
            <p
              className="font-medium leading-none"
              style={{ fontSize: '11px' }}
            >
              {label}
            </p>
          )}

          {isLoading ? (
            <Skeleton className="h-4 w-14 rounded-full" />
          ) : (
            <p className="text-xs font-mono">{formattedBalance}</p>
          )}
        </div>
      </div>
    );
  },
);

AccountOverviewStat.displayName = 'AccountOverviewStat';
