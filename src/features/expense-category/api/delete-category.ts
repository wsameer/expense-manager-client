import axiosInstance from '@/lib/api-client';
import useSWRMutation from 'swr/mutation';
import { EXPENSE_CATEGORIES_API } from '../constants';
import { useSWRConfig } from 'swr';
import { cache } from 'swr/_internal';
import { handleError } from '@/lib/handle-error';
import { Category } from '../types';

const deleteExpenseCategoryFetcher = async (
  url: string,
  { arg: id }: { arg: string },
): Promise<void> => {
  try {
    await axiosInstance.delete(`${url}/${id}`);
  } catch (error) {
    throw handleError(error);
  }
};

export const useDeleteExpenseCategory = () => {
  const { mutate } = useSWRConfig();
  const { trigger, isMutating, error } = useSWRMutation(
    EXPENSE_CATEGORIES_API,
    deleteExpenseCategoryFetcher,
  );

  const deleteCategory = async (categoryId: number) => {
    // Store the current categories before deletion
    const currentExpenseCategories = cache.get(EXPENSE_CATEGORIES_API)?.data;

    try {
      // optimistic update
      mutate(
        EXPENSE_CATEGORIES_API,
        (categories: Category[] | undefined) =>
          categories?.filter((category) => category.id !== categoryId),
        false,
      );

      await trigger(categoryId.toString());
    } catch (error) {
      mutate(EXPENSE_CATEGORIES_API, currentExpenseCategories, false);
      console.error('Failed to delete category:', error);
      throw error;
    }
  };

  return { deleteCategory, isDeleting: isMutating, error };
};
