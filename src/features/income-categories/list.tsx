import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

import { ErrorMessage } from '@/components/errors/error-message';
import { Busy } from '@/components/shared/busy';
import { toast } from '@/hooks/use-toast';
import { useIncomeCategoriesStore } from '@/features/income-categories/income-categories-store';

import { useIncomeCategories } from './api/use-categories';
import { AddIncomeCategoryForm } from './features/add-income-form';
import { CategoryActionButtons } from './components/category-action-buttons';
import { useDeleteCategoryHandler } from './hooks/use-delete-category-handler';
import { CategoryList } from './components/category-list';
import { IncomeCategory } from './types';

export const IncomeCategoryList = () => {
  const { t } = useTranslation(['common', 'categories']);
  const { handleDeleteCategory } = useDeleteCategoryHandler();
  const { setIncomeCategories } = useIncomeCategoriesStore();
  const { incomeCategories, isLoading, isError, replace } =
    useIncomeCategories();

  const [isListDirty, setIsListDirty] = useState(false);
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<IncomeCategory>();

  const handleReplaceCategories = async (categories: IncomeCategory[]) => {
    try {
      await replace({ categories });
      setIsListDirty(false);
    } catch (error) {
      console.error('Error updating categories:', error);
      toast({
        title: t('common:errors.operation-failed'),
        description: t('categories:income.failed-to-update'),
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setIsListDirty(true);
      const oldIndex = incomeCategories!.findIndex(
        (category) => category.id === active.id,
      );
      const newIndex = incomeCategories!.findIndex(
        (category) => category.id === over.id,
      );

      const reorderedItems = arrayMove(
        incomeCategories!,
        oldIndex,
        newIndex,
      ).map((item, index) => ({
        ...item,
        order: index + 1,
      }));

      setIncomeCategories(reorderedItems);
    }
  };

  const handleCategoryClick = (category: IncomeCategory) => {
    setOpenCategoryModal(true);
    setSelectedCategory(category);
  };

  const handleAddNewCategory = () => {
    setSelectedCategory(undefined);
    setOpenCategoryModal(true);
  };

  if (isError) {
    return <ErrorMessage classes="pt-48" />;
  }

  if (isLoading) {
    return (
      <div
        id="income-categories-settings-list-container"
        className="grid justify-items-center grid-cols-1 gap-2 mt-4"
      >
        <Busy />
      </div>
    );
  }

  return (
    <div
      id="income-categories-settings-list-container"
      className="grid justify-items-center grid-cols-1 gap-2 mt-4"
    >
      <CategoryActionButtons
        isListDirty={isListDirty}
        onSaveChanges={() => handleReplaceCategories(incomeCategories!)}
        onAddNew={handleAddNewCategory}
      />

      <CategoryList
        categories={incomeCategories}
        onDragEnd={handleDragEnd}
        onCategoryClick={handleCategoryClick}
      />

      {openCategoryModal && (
        <AddIncomeCategoryForm
          open={openCategoryModal}
          onOpenChange={setOpenCategoryModal}
          selectedCategory={selectedCategory}
          handleOnDelete={(categoryId) =>
            handleDeleteCategory(categoryId, () => setOpenCategoryModal(false))
          }
        />
      )}
    </div>
  );
};
