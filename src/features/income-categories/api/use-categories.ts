import { useCallback, useEffect, useRef } from 'react';
import { AxiosError } from 'axios';
import useSWR from 'swr';

import axiosInstance from '@/lib/api-client';
import { cleanString } from '@/lib/utils';
import { IncomeCategory } from '../types';
import { INCOME_CATEGORIES_API } from '../constants';
import { useIncomeCategoriesStore } from '../income-categories-store';

interface CategoryInput {
  name: string;
  description: string;
}

const globalFetchState = {
  isInitiallyFetched: false,
  isFetching: false,
  lastFetchedAt: 0,
};

export const useIncomeCategories = (options = { forceRefresh: false }) => {
  const {
    incomeCategories,
    error,
    setIncomeCategories,
    setError,
    setLastFetched,
  } = useIncomeCategoriesStore();

  const mountedRef = useRef(true);

  const shouldFetch = useCallback(() => {
    if (options.forceRefresh) return true;

    const currentTime = Date.now();
    const timeSinceLastFetch = currentTime - globalFetchState.lastFetchedAt;
    const freshnessPeriod = 60000 * 5; // 5 minutes

    return (
      !globalFetchState.isInitiallyFetched ||
      timeSinceLastFetch > freshnessPeriod
    );
  }, [options.forceRefresh]);

  const {
    data,
    error: fetchError,
    isValidating,
    mutate,
  } = useSWR<IncomeCategory[], AxiosError>(
    shouldFetch() ? INCOME_CATEGORIES_API : null,
    async (url) => {
      if (globalFetchState.isFetching) {
        // Wait for existing fetch to complete
        return incomeCategories || [];
      }

      globalFetchState.isFetching = true;

      try {
        const res = await axiosInstance.get<IncomeCategory[]>(url);
        globalFetchState.lastFetchedAt = Date.now();
        globalFetchState.isInitiallyFetched = true;
        return res.data;
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      } finally {
        globalFetchState.isFetching = false;
      }
    },
    {
      onSuccess: (data) => {
        setIncomeCategories(data);
        setLastFetched(Date.now());
      },
      onError: (error) => {
        setError(error);
      },
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // 1 minute
      // Use data from store as fallback while loading
      fallbackData: incomeCategories,
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

      const optimisticCategory: IncomeCategory = {
        id: tempId,
        ...categoryData,
        order: nextOrder,
      };

      // optimistic update
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

        globalFetchState.lastFetchedAt = Date.now();
        setLastFetched(Date.now());
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
    [
      data,
      getNextOrderNumber,
      incomeCategories,
      mutate,
      setIncomeCategories,
      setLastFetched,
    ],
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

      const optimisticUpdatedCategories = currentCategories.map((category) => ({
        ...category,
      }));
      optimisticUpdatedCategories[categoryIndex] = optimisticCategory;

      setIncomeCategories(optimisticUpdatedCategories);
      mutate(optimisticUpdatedCategories, false);

      try {
        const response = await axiosInstance.put<IncomeCategory>(
          `${INCOME_CATEGORIES_API}/${categoryId}`,
          optimisticCategory,
        );

        // Create a fresh copy for the server update
        const serverUpdatedCategories = optimisticUpdatedCategories.map(
          (category) => ({ ...category }),
        );
        serverUpdatedCategories[categoryIndex] = response.data;

        globalFetchState.lastFetchedAt = Date.now();
        setLastFetched(Date.now());
        setIncomeCategories(serverUpdatedCategories);
        mutate(serverUpdatedCategories, false);

        return response.data;
      } catch (error) {
        setIncomeCategories(currentCategories);
        mutate(currentCategories, false);
        throw error instanceof Error ? error : new Error(String(error));
      }
    },
    [data, incomeCategories, mutate, setIncomeCategories, setLastFetched],
  );

  // more like a put request with entire data set to replace
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
        globalFetchState.lastFetchedAt = Date.now();
        setLastFetched(Date.now());

        setIncomeCategories(newCategories);
        await mutate(newCategories, false);

        return newCategories;
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },
    [mutate, setIncomeCategories, setLastFetched],
  );

  const deleteCategory = useCallback(
    async (categoryId: number) => {
      // Store the current categories before deletion
      const currentCategories = [...(incomeCategories || [])];
      const categoryIndex = currentCategories.findIndex(
        (category) => category.id === categoryId,
      );

      if (categoryIndex === -1) {
        throw new Error(`Category with ID ${categoryId} not found`);
      }

      const updatedCategories: IncomeCategory[] = currentCategories.filter(
        (category) => category.id !== categoryId,
      );

      setIncomeCategories(updatedCategories);
      mutate(updatedCategories, false);

      try {
        await axiosInstance.delete(`${INCOME_CATEGORIES_API}/${categoryId}`);
        globalFetchState.lastFetchedAt = Date.now();
        setLastFetched(Date.now());
      } catch (error) {
        setIncomeCategories(currentCategories);
        mutate(currentCategories, false);
        throw error instanceof Error ? error : new Error(String(error));
      }
    },
    [incomeCategories, mutate, setIncomeCategories, setLastFetched],
  );

  // Calculate income category options for select fields
  const incomeCategoryOptions = (data || incomeCategories || []).map(
    (category) => ({
      id: category.id,
      label: category.name,
      value: cleanString(category.name),
    }),
  );

  const refresh = useCallback(() => {
    return mutate();
  }, [mutate]);

  useEffect(() => {
    if (fetchError) {
      setError(fetchError);
    }
  }, [fetchError, setError]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      // This ensures any in-flight SWR mutations are ignored when unmounting
      mutate(undefined, { revalidate: false });
    };
  }, [mutate]);

  return {
    incomeCategories: incomeCategories || [],
    isLoading: isValidating && !incomeCategories?.length,
    isRefreshing: isValidating && !!incomeCategories?.length,
    isError: !!error || !!fetchError,
    incomeCategoryOptions,
    createCategory,
    updateCategory,
    deleteCategory,
    replace,
    refresh,
  };
};
