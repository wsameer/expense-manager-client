import useSWRMutation from 'swr/mutation';
import { useSWRConfig } from 'swr';
import { cache } from 'swr/_internal';

import { handleError } from '@/lib/handle-error';
import axiosInstance from '@/lib/api-client';

import { TRANSACTIONS_API } from '../constants';
import { Transaction } from '../types';

const deleteTransactionFetcher = async (
  url: string,
  { arg: id }: { arg: string },
): Promise<void> => {
  try {
    await axiosInstance.delete(`${url}/${id}`);
  } catch (error) {
    throw handleError(error);
  }
};

export const useDeleteTransaction = (month: string) => {
  const { mutate } = useSWRConfig();
  const { trigger, isMutating, error } = useSWRMutation(
    TRANSACTIONS_API,
    deleteTransactionFetcher,
  );

  const deleteTransaction = async (transactionId: number) => {
    // Store the current categories before deletion
    const currentTransactions = cache.get(
      `${TRANSACTIONS_API}?month=${month}`,
    )?.data;

    try {
      // optimistic update
      mutate(
        `${TRANSACTIONS_API}?month=${month}`,
        (transactions: Transaction[] | undefined) =>
          transactions?.filter((t) => t.id !== transactionId),
        false,
      );

      await trigger(transactionId.toString());
    } catch (error) {
      mutate(`${TRANSACTIONS_API}?month=${month}`, currentTransactions, false);
      console.error('Failed to delete transaction:', error);
      throw error;
    }
  };

  /**
   * Delete ALL the Transactions for the logged in user.
   * !! THIS IS A DANGEROUS OPERATION !!
   */
  const deleteAllTransactions = async () => {
    // store current transaction state before deleting
    const existingTransactions = cache.get(
      `${TRANSACTIONS_API}?month=${month}`,
    )?.data;

    try {
      // optimistic update for the current view
      mutate(`${TRANSACTIONS_API}?month=${month}`, [], false);

      //actual API call to delete all transactions
      await trigger('all');

      // Clear all cached data for any month that might be in the cache
      mutate(
        (key) => typeof key === 'string' && key.startsWith(TRANSACTIONS_API),
        [],
        false,
      );
    } catch (error) {
      // Only rollback the current month's view since that's what we backed up
      mutate(`${TRANSACTIONS_API}?month=${month}`, existingTransactions, false);
      console.error('Failed to delete all transactions:', error);
      throw error;
    }
  };

  return {
    deleteTransaction,
    deleteAllTransactions,
    isDeleting: isMutating,
    error,
  };
};
