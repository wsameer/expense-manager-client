import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { MoreVertical, Pencil, Plus, Trash } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { IncomeCategory } from './types';
import { Busy } from '@/components/shared/busy';
import { ErrorMessage } from '@/components/errors/error-message';
import { useConfirmDialog } from '@/components/ui/confirmable';
import { useIncomeCategories } from './api/use-categories';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks';
import { useDeleteIncomeCategory } from './api/delete-category';
import { AddIncomeCategoryForm } from './component/add-income-form';

export const IncomeCategoryList = () => {
  const { t } = useTranslation(['common', 'categories']);
  const { openConfirmDialog } = useConfirmDialog();
  const { deleteCategory } = useDeleteIncomeCategory();
  const { incomeCategories, isLoading, isError } = useIncomeCategories();

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
          {incomeCategories?.map((category) => (
            <div
              className="bg-white dark:bg-zinc-800 rounded-xl overflow-hidden w-full"
              key={category.id}
            >
              <div className="flex items-center justify-between space-x-4 pl-4 pr-2 py-2">
                <div className="flex items-center gap-2">
                  <small className="text-sm font-medium leading-none">
                    {category.name}
                  </small>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                    >
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">{t('common:more')}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setOpenCategoryModal(true);
                        setSelectedCategory(category);
                      }}
                    >
                      <Pencil className="h-3.5 w-3.5 mr-2" /> {t('common:edit')}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-500 focus:text-red-700"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash className="h-3.5 w-3.5 mr-2" />{' '}
                      {t('common:delete')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}

          <AddIncomeCategoryForm
            open={openCategoryModal}
            onOpenChange={setOpenCategoryModal}
            selectedCategory={selectedCategory}
          />
        </>
      )}
    </div>
  );
};
