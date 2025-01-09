import { AxiosError } from 'axios';
import { useCallback } from 'react';
import useSWR from 'swr';

import axiosInstance from '@/lib/api-client';
import { Account, AccountGroup } from '@/types/api';
import { ACCOUNTS_API } from '../constants';

const fetchAccounts = async (url: string): Promise<Account[]> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = await axiosInstance.get<any[]>(url);
  return res.data.map((account) => ({
    ...account,
    balance: parseFloat(account.balance),
  }));
};

export const useAccounts = () => {
  const { data, error, mutate } = useSWR<Account[], AxiosError>(
    ACCOUNTS_API,
    fetchAccounts,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // 1 minute
    },
  );

  const getBalanceSumByGroup = useCallback(
    (group: AccountGroup): number => {
      if (!data) return 0;
      return data
        .filter((account) => account.group === group)
        .reduce((sum, account) => sum + +account.balance, 0);
    },
    [data],
  );

  const refetchAccounts = useCallback(() => mutate(), [mutate]);

  return {
    allAccounts: data,
    isLoading: !error && !data,
    isError: error,
    refetchAccounts,
    getBalanceSumByGroup,
  };
};
