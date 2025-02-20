import React, { useMemo } from 'react';
import { LucideIcon } from 'lucide-react';
import useSWR from 'swr';

import axiosInstance from '@/lib/api-client';
import { QueryKey } from '../types';
import { ACCOUNTS_STATS_API } from '../constants';
import { StatCard } from '@/components/shared/stat-card';

type Props = {
  label: string;
  queryKey: QueryKey;
  icon: LucideIcon;
};

type ApiResponse = { statType: string; totalBalance: number };

export const FinancialStat = React.memo(
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

    const labelColor = useMemo(() => {
      if (queryKey === 'debt') return 'text-red-600';
      if (queryKey === 'asset') return 'text-green-600';
      if (queryKey === 'total') return 'text-green-600';
      return '';
    }, [queryKey]);

    return (
      <StatCard
        isLoading={isLoading}
        label={label}
        value={data?.totalBalance ?? 0}
        iconClass={`h-4 w-4 ${labelColor}`}
        icon={Icon}
      />
    );
  },
);

FinancialStat.displayName = 'FinancialStat';
