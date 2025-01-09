import { Account } from '@/types/api';
import { handleError } from '@/lib/handle-error';
import useSWRMutation from 'swr/mutation';
import axiosInstance from '@/lib/api-client';
import { useSWRConfig } from 'swr';
import { TRANSACTIONS_API } from '@/features/transactions/constants';
import { CreateTransactionPayload } from '@/features/transactions/types';

const updateTransactionFetcher = async (
  url: string,
  { arg }: { arg: CreateTransactionPayload & { id: number } },
): Promise<Account> => {
  try {
    const res = await axiosInstance.put<Account>(`${url}/${arg.id}`, arg);
    return res.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const useUpdateTransaction = () => {
  const { mutate } = useSWRConfig();
  const { trigger, isMutating, error } = useSWRMutation(
    TRANSACTIONS_API,
    updateTransactionFetcher,
  );

  const updateTransaction = async (
    formData: CreateTransactionPayload,
    accountId: number,
  ) => {
    try {
      const result = await trigger({ ...formData, id: accountId });
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
      console.error('Failed to update account:', error);
      throw error;
    }
  };

  return { updateTransaction, isUpdating: isMutating, error };
};
