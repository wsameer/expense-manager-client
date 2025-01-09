import { Subcategory } from '../types';
import { EXPENSE_CATEGORIES_API } from '../constants';
import axiosInstance from '@/lib/api-client';
import { useCallback, useMemo } from 'react';

interface SubcategoryInput {
  name: string;
}

export const useExpenseSubcategories = (categoryId: number) => {
  const url = `${EXPENSE_CATEGORIES_API}/${categoryId}/subcategories`;

  const createSubcategory = useCallback(
    async (subcategoryData: SubcategoryInput): Promise<Subcategory> => {
      const response = await axiosInstance.post<Subcategory>(
        url,
        subcategoryData,
      );
      return response.data;
    },
    [url],
  );

  const updateSubcategory = useCallback(
    async (
      subcategoryId: number,
      subcategoryData: SubcategoryInput,
    ): Promise<Subcategory> => {
      const response = await axiosInstance.put<Subcategory>(
        `${url}/${subcategoryId}`,
        subcategoryData,
      );
      return response.data;
    },
    [url],
  );

  const deleteSubcategory = useCallback(
    async (subcategoryId: number): Promise<void> => {
      await axiosInstance.delete(`${url}/${subcategoryId}`);
    },
    [url],
  );

  return useMemo(
    () => ({
      createSubcategory,
      updateSubcategory,
      deleteSubcategory,
    }),
    [createSubcategory, updateSubcategory, deleteSubcategory],
  );
};
