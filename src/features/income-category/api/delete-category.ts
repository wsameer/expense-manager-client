import axiosInstance from '@/lib/api-client';
import useSWRMutation from 'swr/mutation';
import { useSWRConfig } from 'swr';
import { cache } from 'swr/_internal';
import { handleError } from '@/lib/handle-error';
import { IncomeCategory } from '../types';
import { INCOME_CATEGORIES_API } from '../constants';

const deleteIncomeCategory = async (
  url: string,
  { arg: id }: { arg: string },
): Promise<void> => {
  try {
    await axiosInstance.delete(`${url}/${id}`);
  } catch (error) {
    throw handleError(error);
  }
};

export const useDeleteIncomeCategory = () => {
  const { mutate } = useSWRConfig();
  const { trigger, isMutating, error } = useSWRMutation(
    INCOME_CATEGORIES_API,
    deleteIncomeCategory,
  );

  const deleteCategory = async (categoryId: number) => {
    // Store the current categories before deletion
    const currentExpenseCategories = cache.get(INCOME_CATEGORIES_API)?.data;

    try {
      // optimistic update
      mutate(
        INCOME_CATEGORIES_API,
        (categories: IncomeCategory[] | undefined) =>
          categories?.filter((category) => category.id !== categoryId),
        false,
      );

      await trigger(categoryId.toString());
    } catch (error) {
      mutate(INCOME_CATEGORIES_API, currentExpenseCategories, false);
      throw error;
    }
  };

  return { deleteCategory, isDeleting: isMutating, error };
};
