import useSWRMutation from 'swr/mutation';

import axiosInstance from '@/lib/api-client';
import { Account } from '@/types/api';
import { ACCOUNTS_API } from '../constants';
import { CreateAccountForm } from '../types';
import { handleError } from '@/lib/handle-error';
import { useSWRConfig } from 'swr';

const createAccountFetcher = async (
  url: string,
  { arg }: { arg: CreateAccountForm },
): Promise<Account> => {
  try {
    const response = await axiosInstance.post<Account>(url, arg);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const useCreateAccount = () => {
  const { mutate } = useSWRConfig();
  const { trigger, isMutating, error } = useSWRMutation(
    ACCOUNTS_API,
    createAccountFetcher,
  );

  const createAccount = async (accountData: CreateAccountForm) => {
    try {
      const result = await trigger(accountData);
      mutate(
        ACCOUNTS_API,
        (currentAccounts: Account[] = []) => [...currentAccounts, result],
        false,
      );
      return result;
    } catch (error) {
      console.error('Failed to create account:', error);
      throw error;
    }
  };

  return { createAccount, isCreating: isMutating, error };
};
