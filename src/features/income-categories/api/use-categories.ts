import { useCallback, useMemo } from 'react';
import { AxiosError } from 'axios';
import useSWR from 'swr';

import axiosInstance from '@/lib/api-client';
import { cleanString } from '@/lib/utils';
import { IncomeCategory } from '../types';
import { INCOME_CATEGORIES_API } from '../constants';

interface CategoryInput {
  name: string;
  description: string;
}

const fetchIncomeCategories = async (
  url: string,
): Promise<IncomeCategory[]> => {
  const res = await axiosInstance.get<IncomeCategory[]>(url);
  return res.data;
};

export const useIncomeCategories = () => {
  const { data, error, mutate } = useSWR<IncomeCategory[], AxiosError>(
    INCOME_CATEGORIES_API,
    fetchIncomeCategories,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // 1 minute
    },
  );

  const lastOrderNumber = data?.[data?.length - 1].order;

  const createCategory = useCallback(
    async (categoryData: CategoryInput): Promise<IncomeCategory> => {
      const response = await axiosInstance.post<IncomeCategory>(
        INCOME_CATEGORIES_API,
        { ...categoryData, order: (lastOrderNumber ?? 0) + 1 },
      );
      await mutate(); // Revalidate the cache
      return response.data;
    },
    [lastOrderNumber, mutate],
  );

  const updateCategory = useCallback(
    async (
      categoryId: number,
      categoryData: CategoryInput,
    ): Promise<IncomeCategory> => {
      const response = await axiosInstance.put<IncomeCategory>(
        `${INCOME_CATEGORIES_API}/${categoryId}`,
        categoryData,
      );
      await mutate(); // Revalidate the cache
      return response.data;
    },
    [mutate],
  );

  const incomeCategoryOptions = useMemo(() => {
    if (!data) return [];

    return data.map((d) => {
      return {
        id: d.id,
        label: d.name,
        value: cleanString(d.name),
      };
    });
  }, [data]);

  const replace = useCallback(
    async (data: { categories: IncomeCategory[] }) => {
      const response = await axiosInstance.put<IncomeCategory[]>(
        `${INCOME_CATEGORIES_API}/replace`,
        data,
      );
      return response.data;
    },
    [],
  );

  const updateCache = useCallback(
    (newCategories: IncomeCategory[]) => {
      mutate(newCategories, false);
    },
    [mutate],
  );

  return {
    incomeCategories: data,
    isLoading: !error && !data,
    isError: error,
    incomeCategoryOptions,
    createCategory,
    updateCategory,
    updateCache,
    replace,
  };
};
