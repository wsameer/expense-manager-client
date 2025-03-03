import { Check, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

interface CategoryActionButtonsProps {
  isListDirty: boolean;
  onSaveChanges: () => void;
  onAddNew: () => void;
}

export const CategoryActionButtons = ({
  isListDirty,
  onSaveChanges,
  onAddNew,
}: CategoryActionButtonsProps) => {
  const { t } = useTranslation(['common', 'categories']);

  if (isListDirty) {
    return (
      <Button
        className="flex justify-center content-center gap-2 mb-3 w-full rounded-xl"
        variant="default"
        size="lg"
        onClick={onSaveChanges}
      >
        <Check className="h-4 w-4" />
        {t('common:save-changes')}
      </Button>
    );
  }

  return (
    <Button
      className="flex justify-center content-center gap-2 mb-3 w-full rounded-xl"
      variant="dashed"
      size="lg"
      onClick={onAddNew}
    >
      <Plus className="h-4 w-4" />
      {t('categories:income.new-income-category')}
    </Button>
  );
};
