import { AxiosError } from 'axios';
import useSWR from 'swr';
import { Category } from '../types';
import { EXPENSE_CATEGORIES_API } from '../constants';
import axiosInstance from '@/lib/api-client';
import { useCallback } from 'react';

interface CategoryInput {
  name: string;
  order?: number;
}

const fetchExpenseCategories = async (url: string): Promise<Category[]> => {
  const res = await axiosInstance.get<Category[]>(url);
  return res.data;
};

export const useExpenseCategories = () => {
  const { data, error, mutate } = useSWR<Category[], AxiosError>(
    EXPENSE_CATEGORIES_API,
    fetchExpenseCategories,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // 1 minute
    },
  );

  const lastOrderNumber = data?.[data?.length - 1].order;

  const createCategory = useCallback(
    async (categoryData: CategoryInput): Promise<Category> => {
      const response = await axiosInstance.post<Category>(
        EXPENSE_CATEGORIES_API,
        { ...categoryData, order: (lastOrderNumber ?? 0) + 1 },
      );
      await mutate(); // Revalidate the cache
      return response.data;
    },
    [lastOrderNumber, mutate],
  );

  const updateCategory = useCallback(
    async (
      categoryId: string,
      categoryData: CategoryInput,
    ): Promise<Category> => {
      const response = await axiosInstance.put<Category>(
        `${EXPENSE_CATEGORIES_API}/${categoryId}`,
        categoryData,
      );
      // await mutate(); // Revalidate the cache
      return response.data;
    },
    [],
  );

  const refetchExpenseCategories = useCallback(() => mutate(), [mutate]);

  return {
    expenseCategories: data,
    isLoading: !error && !data,
    isError: error,
    createCategory,
    updateCategory,
    refetchExpenseCategories,
  };
};
