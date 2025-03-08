import { AxiosError } from 'axios';
import { useCallback, useEffect } from 'react';
import useSWR from 'swr';

import { Account, AccountGroup, useAccountStore } from '@/store/accountsStore';
import axiosInstance from '@/lib/api-client';
import { ACCOUNTS_API } from '../constants';

export const useAccounts = () => {
  const { accounts, error, isLoading, setAccounts, setLoading, setError } =
    useAccountStore();

  const fetchAccounts = async (url: string): Promise<Account[]> => {
    setLoading(true);
    try {
      const res = await axiosInstance.get<Account[]>(url);
      return res.data;
    } catch (error) {
      setError(error instanceof Error ? error : new Error(String(error)));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const {
    data,
    error: fetchError,
    isValidating,
  } = useSWR<Account[], AxiosError>(ACCOUNTS_API, fetchAccounts, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000, // 1 minute
  });

  const getBalanceSumByGroup = useCallback(
    (group: AccountGroup): number => {
      if (!data) return 0;
      return data
        .filter((account) => account.group === group)
        .reduce((sum, account) => sum + +account.balance, 0);
    },
    [data],
  );

  // Sync API data with Zustand store
  useEffect(() => {
    if (data) {
      setAccounts(data);
    }
  }, [data, setAccounts]);

  useEffect(() => {
    if (fetchError) {
      setError(fetchError);
    }
  }, [fetchError, setError]);

  return {
    allAccounts: accounts,
    isLoading: isLoading || isValidating,
    isError: !!error,
    getBalanceSumByGroup,
  };
};
