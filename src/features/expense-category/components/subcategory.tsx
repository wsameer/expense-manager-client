import { useTranslation } from 'react-i18next';
import { Pencil, Trash2 } from 'lucide-react';

import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useConfirmDialog } from '@/components/ui/confirmable';
import { toast } from '@/hooks';
import { useExpenseSubcategories } from '../api/use-subcategories';
import { Subcategory } from '../types';

type Props = {
  categoryId: number;
  data: Subcategory;
  onEdit: (value: Subcategory) => void;
  mutateCategories: () => void;
};

export const SubcategoryItem = ({
  data,
  categoryId,
  mutateCategories,
  onEdit,
}: Props) => {
  const { t } = useTranslation(['common', 'categories']);
  const { deleteSubcategory } = useExpenseSubcategories(categoryId);
  const { openConfirmDialog } = useConfirmDialog();

  const handleDeleteSubcategory = () => {
    openConfirmDialog({
      title: t('common:alert.are-you-sure'),
      message: t('common:alert.this-action-cannot-be-undone'),
      onConfirm: async () => {
        try {
          await deleteSubcategory(data.id);
          mutateCategories();
          toast({
            title: t('common:alert.deleted'),
            description: t('categories:expense.subcategory-is-deleted'),
          });
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_) {
          toast({
            title: t('common:errors.operation-failed'),
            description: t('categories:expense.failed-to-delete-subcategory'),
          });
        }
      },
    });
  };

  return (
    <div
      key={data.id}
      className="border-t text-sm"
    >
      <div className="flex items-center justify-between space-x-4 pl-4 pr-2 py-2">
        <small className="text-sm font-medium leading-none">{data.name}</small>
        <div className="flex items-center space-x-1 mt-0">
          <Separator
            orientation="vertical"
            className="mx-1 h-4"
          />
          <Button
            className="text-red-500 hover:text-red-700 h-6 w-6"
            variant="ghost"
            size="icon"
            onClick={handleDeleteSubcategory}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
          <Button
            className="h-6 w-6"
            variant="ghost"
            size="icon"
            onClick={() => onEdit(data)}
          >
            <Pencil className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};
