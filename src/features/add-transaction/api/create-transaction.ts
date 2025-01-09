import useSWRMutation from 'swr/mutation';

import axiosInstance from '@/lib/api-client';
import { handleError } from '@/lib/handle-error';
import { useSWRConfig } from 'swr';
import { TRANSACTIONS_API } from '@/features/transactions/constants';
import { CreateTransactionPayload } from '@/features/transactions/types';

const createTransactionFetcher = async (
  url: string,
  { arg }: { arg: CreateTransactionPayload },
) => {
  try {
    const response = await axiosInstance.post(url, arg);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const useCreateTransaction = () => {
  const { mutate } = useSWRConfig();
  const { trigger, isMutating, error } = useSWRMutation(
    TRANSACTIONS_API,
    createTransactionFetcher,
  );

  const createTransaction = async (
    transactionData: CreateTransactionPayload,
  ) => {
    try {
      const result = await trigger(transactionData);
      mutate(
        (key: string) => {
          return (
            typeof key === 'string' &&
            key.startsWith(`${TRANSACTIONS_API}?month=`)
          );
        },
        undefined,
        { revalidate: true },
      );
      return result;
    } catch (error) {
      console.error('Failed to create a transaction:', error);
      throw error;
    }
  };

  return { createTransaction, isCreating: isMutating, error };
};
