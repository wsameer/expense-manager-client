import { useCallback, useEffect } from 'react';
import { AxiosError } from 'axios';
import useSWR from 'swr';

import axiosInstance from '@/lib/api-client';
import { cleanString } from '@/lib/utils';
import { IncomeCategory } from '../types';
import { INCOME_CATEGORIES_API } from '../constants';
import { useIncomeCategoriesStore } from '../store/incomeCategoryStore';

interface CategoryInput {
  name: string;
  description: string;
}

export const useIncomeCategories = () => {
  const { incomeCategories, error, setIncomeCategories, setError } =
    useIncomeCategoriesStore();

  const {
    data,
    error: fetchError,
    isValidating,
    mutate,
  } = useSWR<IncomeCategory[], AxiosError>(
    INCOME_CATEGORIES_API,
    async (url) => {
      try {
        const response = await axiosInstance.get<IncomeCategory[]>(url);
        return response.data;
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // 1 minute
      onSuccess: (data) => setIncomeCategories(data),
      onError: (error) => setError(error),
    },
  );

  const getNextOrderNumber = useCallback(() => {
    const categories = data || incomeCategories;
    if (!categories.length) return 1;

    return Math.max(...categories.map((c) => c.order || 0)) + 1;
  }, [data, incomeCategories]);

  const createCategory = useCallback(
    async (categoryData: CategoryInput): Promise<IncomeCategory> => {
      // Generate a temporary ID for the optimistic update
      const tempId = Date.now();
      const nextOrder = getNextOrderNumber();

      // optimistic update
      const optimisticCategory: IncomeCategory = {
        id: tempId,
        ...categoryData,
        order: nextOrder,
      };
      const currentCategories = [...(data || incomeCategories || [])];
      const updatedCategories = [...currentCategories, optimisticCategory];

      setIncomeCategories(updatedCategories);
      mutate(updatedCategories, false);

      try {
        const response = await axiosInstance.post<IncomeCategory>(
          INCOME_CATEGORIES_API,
          { ...categoryData, order: nextOrder },
        );

        // Update with the real data from the server
        const serverCategory = response.data;
        const finalCategories = updatedCategories.map((cat) =>
          cat.id === tempId ? serverCategory : cat,
        );

        setIncomeCategories(finalCategories);
        mutate(finalCategories, false);

        return serverCategory;
      } catch (error) {
        // Revert to the previous state
        setIncomeCategories(currentCategories);
        mutate(currentCategories, false);
        throw error instanceof Error ? error : new Error(String(error));
      }
    },
    [data, getNextOrderNumber, incomeCategories, mutate, setIncomeCategories],
  );

  const updateCategory = useCallback(
    async (
      categoryId: number,
      categoryData: CategoryInput,
    ): Promise<IncomeCategory> => {
      const currentCategories = [...(data || incomeCategories || [])];
      const categoryIndex = currentCategories.findIndex(
        (cat) => cat.id === categoryId,
      );

      if (categoryIndex === -1) {
        throw new Error(`Category with ID ${categoryId} not found`);
      }

      const optimisticCategory: IncomeCategory = {
        ...currentCategories[categoryIndex],
        ...categoryData,
      };

      const updatedCategories = [...currentCategories];
      updatedCategories[categoryIndex] = optimisticCategory;

      setIncomeCategories(updatedCategories);
      mutate(updatedCategories, false);

      try {
        const response = await axiosInstance.put<IncomeCategory>(
          `${INCOME_CATEGORIES_API}/${categoryId}`,
          categoryData,
        );

        // Update with the real data from the server
        const serverCategory = response.data;
        updatedCategories[categoryIndex] = serverCategory;

        setIncomeCategories(updatedCategories);
        mutate(updatedCategories, false);

        return serverCategory;
      } catch (error) {
        setIncomeCategories(currentCategories);
        mutate(currentCategories, false);
        throw error instanceof Error ? error : new Error(String(error));
      }
    },
    [data, incomeCategories, mutate, setIncomeCategories],
  );

  const replace = useCallback(
    async (data: {
      categories: IncomeCategory[];
    }): Promise<IncomeCategory[]> => {
      try {
        const response = await axiosInstance.put<IncomeCategory[]>(
          `${INCOME_CATEGORIES_API}/replace`,
          data,
        );

        // Update both cache and store
        const newCategories = response.data;
        setIncomeCategories(newCategories);
        await mutate(newCategories, false);

        return newCategories;
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },
    [mutate, setIncomeCategories],
  );

  // Calculate income category options for select fields
  const incomeCategoryOptions = (data || incomeCategories || []).map(
    (category) => ({
      id: category.id,
      label: category.name,
      value: cleanString(category.name),
    }),
  );

  useEffect(() => {
    if (fetchError) {
      setError(fetchError);
    }
  }, [fetchError, setError]);

  return {
    incomeCategories: incomeCategories || [],
    isLoading: isValidating,
    isError: !!error || !!fetchError,
    incomeCategoryOptions,
    createCategory,
    updateCategory,
    replace,
    refresh: () => mutate(),
  };
};
