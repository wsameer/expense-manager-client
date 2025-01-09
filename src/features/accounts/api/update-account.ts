import { Account } from '@/types/api';
import { handleError } from '@/lib/handle-error';
import useSWRMutation from 'swr/mutation';
import { ACCOUNTS_API } from '../constants';
import axiosInstance from '@/lib/api-client';
import { useSWRConfig } from 'swr';
import { CreateAccountForm } from '../types';

const updateAccountFetcher = async (
  url: string,
  { arg }: { arg: CreateAccountForm & { id: number } },
): Promise<Account> => {
  try {
    const res = await axiosInstance.put<Account>(`${url}/${arg.id}`, arg);
    return res.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const useUpdateAccount = () => {
  const { mutate } = useSWRConfig();
  const { trigger, isMutating, error } = useSWRMutation(
    ACCOUNTS_API,
    updateAccountFetcher,
  );

  const updateAccount = async (
    formData: CreateAccountForm,
    accountId: number,
  ) => {
    try {
      const result = await trigger({ ...formData, id: accountId });
      mutate(
        ACCOUNTS_API,
        (accounts: Account[] = []) =>
          accounts.map((a) => (a.id === result.id ? result : a)),
        false,
      );
      return result;
    } catch (error) {
      console.error('Failed to update account:', error);
      throw error;
    }
  };

  return { updateAccount, isUpdating: isMutating, error };
};
