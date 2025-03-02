import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from '@dnd-kit/modifiers';

import { Button } from '@/components/ui/button';
import { Busy } from '@/components/shared/busy';
import { ErrorMessage } from '@/components/errors/error-message';
import { useConfirmDialog } from '@/components/ui/confirmable';
import { EmptyData } from '@/components/shared/empty-data';
import { toast } from '@/hooks';

import { useDeleteIncomeCategory } from './api/delete-category';
import { AddIncomeCategoryForm } from './component/add-income-form';
import { SortableItem } from './component/sortable-item';
import { useIncomeCategories } from './api/use-categories';
import { IncomeCategory } from './types';

export const IncomeCategoryList = () => {
  const { t } = useTranslation(['common', 'categories']);
  const { openConfirmDialog } = useConfirmDialog();
  const { deleteCategory } = useDeleteIncomeCategory();
  const { incomeCategories, isLoading, isError, updateCache, replace } =
    useIncomeCategories();
  const [isListDirty, setIsListDirty] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<IncomeCategory>();

  const handleDeleteCategory = (categoryId: number) => {
    openConfirmDialog({
      title: t('common:alert.are-you-sure'),
      message: t('categories:income:category-delete-warning-message'),
      onConfirm: async () => {
        try {
          await deleteCategory(categoryId);
          toast({
            title: t('common:alert.deleted'),
            description: t('categories:income.category-is-deleted'),
          });
          setOpenCategoryModal(false);
        } catch (error) {
          console.error('Error deleting account:', error);
          toast({
            title: t('common:errors.operation-failed'),
            description: t('categories:income.failed-to-delete'),
          });
        }
      },
    });
  };

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

      updateCache(reorderedItems);
    }
  };

  if (isError) {
    return <ErrorMessage classes="pt-48" />;
  }

  return (
    <div className="grid justify-items-center grid-cols-1 gap-2 mt-4">
      <Button
        className="flex justify-center content-center gap-2 mb-3 w-full rounded-xl"
        variant="dashed"
        size="lg"
        onClick={() => {
          setSelectedCategory(undefined);
          setOpenCategoryModal(true);
        }}
      >
        <Plus className="h-4 w-4" />
        {t('categories:income.new-income-category')}
      </Button>

      {isLoading ? (
        <Busy />
      ) : (
        <>
          {!incomeCategories || incomeCategories.length === 0 ? (
            <EmptyData />
          ) : (
            <DndContext
              sensors={sensors}
              onDragEnd={handleDragEnd}
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
            >
              <SortableContext
                items={incomeCategories}
                strategy={verticalListSortingStrategy}
              >
                {incomeCategories.map((category) => (
                  <SortableItem
                    key={category.id}
                    onClickHandler={(c: IncomeCategory) => {
                      setOpenCategoryModal(true);
                      setSelectedCategory(c);
                    }}
                    category={category}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </>
      )}

      {openCategoryModal && (
        <AddIncomeCategoryForm
          open={openCategoryModal}
          onOpenChange={setOpenCategoryModal}
          selectedCategory={selectedCategory}
          handleOnDelete={handleDeleteCategory}
        />
      )}
    </div>
  );
};
