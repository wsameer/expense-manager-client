import { AxiosError } from 'axios';
import { useCallback } from 'react';
import useSWR from 'swr';

import axiosInstance from '@/lib/api-client';
import { Account } from '@/types/api';
import { ACCOUNTS_API } from '../constants';

interface FetchError {
  message: string;
  statusCode?: number;
}

const fetchAccountById = async (url: string): Promise<Account> => {
  try {
    const res = await axiosInstance.get<Account>(url);
    if (!res.data) {
      throw new Error('No data received from the server');
    }
    return {
      ...res.data,
      balance: parseFloat(res.data.balance.toString()),
    };
  } catch (error) {
    const fetchError: FetchError = {
      message: 'An unexpected error occurred',
    };

    if (error instanceof AxiosError) {
      fetchError.statusCode = error.response?.status;
      fetchError.message = error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      fetchError.message = error.message;
    }

    throw fetchError;
  }
};

export const useAccountById = (id: string | null) => {
  const { data, error, mutate } = useSWR<Account, AxiosError>(
    id ? `${ACCOUNTS_API}/${id}` : null,
    fetchAccountById,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // 1 minute
    },
  );

  const refetchAccount = useCallback(() => mutate(), [mutate]);

  return {
    account: data,
    isLoading: id !== null && !error && !data,
    isError: error,
    refetchAccount,
  };
};
