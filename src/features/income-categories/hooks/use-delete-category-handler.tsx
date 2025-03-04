import { useConfirmDialog } from '@/components/ui/confirmable';
import { useTranslation } from 'react-i18next';
import { useDeleteIncomeCategory } from '../api/delete-category';
import { toast } from '@/hooks';

export const useDeleteCategoryHandler = () => {
  const { t } = useTranslation(['common', 'categories']);
  const { openConfirmDialog } = useConfirmDialog();
  const { deleteCategory } = useDeleteIncomeCategory();

  const handleDeleteCategory = (categoryId: number, onSuccess?: () => void) => {
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
          if (onSuccess) {
            onSuccess();
          }
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

  return { handleDeleteCategory };
};
