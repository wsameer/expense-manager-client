import { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';
import { cache } from 'swr/_internal';

import axiosInstance from '@/lib/api-client';
import { handleError } from '@/lib/handle-error';
import { Account } from '@/store/accountsStore';
import { ACCOUNTS_API } from '../constants';

const deleteAccountFetcher = async (
  url: string,
  { arg: id }: { arg: string },
): Promise<void> => {
  try {
    await axiosInstance.delete(`${url}/${id}`);
  } catch (error) {
    throw handleError(error);
  }
};

export const useDeleteAccount = () => {
  const { mutate } = useSWRConfig();
  const { trigger, isMutating, error } = useSWRMutation(
    ACCOUNTS_API,
    deleteAccountFetcher,
  );

  const deleteAccount = async (id: string) => {
    // Store the current accounts before deletion
    const currentAccounts = cache.get(ACCOUNTS_API);

    try {
      // optimistic update
      mutate(
        ACCOUNTS_API,
        (accounts: Account[] | undefined) =>
          accounts?.filter((account) => account.id !== id),
        false,
      );

      await trigger(id);
    } catch (error) {
      mutate(ACCOUNTS_API, currentAccounts, false);
      console.error('Failed to delete account:', error);
      throw error;
    }
  };

  return { deleteAccount, isDeleting: isMutating, error };
};
