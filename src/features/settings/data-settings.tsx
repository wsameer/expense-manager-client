import { useTranslation } from 'react-i18next';
import { Eraser, FileDown, Trash2 } from 'lucide-react';

import { toast } from '@/hooks';
import { useConfirmDialog } from '@/components/ui/confirmable';
import { ListGroup } from '@/components/list-group';
import { ListItem } from '@/components/list-group/list-item';
import { formatDateToYYYYMM } from '@/lib/utils';

import { ImportDataDialog } from '../import-data';
import { useDeleteTransaction } from '../transactions/api/delete-transaction';

export const DataSettings = () => {
  const { t } = useTranslation(['common', 'settings']);
  const { openConfirmDialog } = useConfirmDialog();
  const { deleteAllTransactions } = useDeleteTransaction(
    formatDateToYYYYMM(new Date()),
  );

  const handleDeleteAllTransaction = () => {
    openConfirmDialog({
      title: t('common:alert.are-you-sure'),
      message: t('transaction:delete-warning-message'),
      onConfirm: async () => {
        try {
          await deleteAllTransactions();
          toast({
            title: t('common:alert.deleted'),
            description: t('transaction:all-transactions-deleted'),
          });
        } catch (error) {
          console.error('Error deleting account:', error);
          toast({
            title: t('common:errors.operation-failed'),
            description: t('transaction:failed-to-delete'),
          });
        }
      },
    });
  };

  return (
    <div
      id="data-settings"
      className="grid grid-cols-1 gap-6"
    >
      <ListGroup title={t('settings:export-import')}>
        <ImportDataDialog />
        <ListItem
          icon={
            <FileDown className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
          }
          label={t('settings:export-to-csv')}
          rightElement={undefined}
        />
        <ListItem
          icon={
            <FileDown className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
          }
          label={t('settings:export-to-pdf')}
          rightElement={undefined}
        />
      </ListGroup>
      <ListGroup title={t('settings:other')}>
        <ListItem
          icon={<Trash2 className="h-4 w-4 text-red-600 dark:text-zinc-300" />}
          label={t('settings:delete-all-transactions')}
          onClick={handleDeleteAllTransaction}
          rightElement={undefined}
        />
        <ListItem
          icon={<Eraser className="h-4 w-4 text-red-600 dark:text-zinc-300" />}
          label={t('settings:erase-data')}
          rightElement={undefined}
          variant="danger"
        />
      </ListGroup>
    </div>
  );
};
