import { useTranslation } from 'react-i18next';
import { Eraser, FileDown, Skull, Trash2 } from 'lucide-react';

import { SETTINGS_ROUTE } from '@/app/router/routes';
import { useConfirmDialog } from '@/components/ui/confirmable';
import { ListGroup } from '@/components/list-group';
import { ListItem } from '@/components/list-group/list-item';
import { formatDateToYYYYMM } from '@/lib/utils';
import { PageLayout } from '@/components/layout/page-layout';

import { useDeleteTransaction } from '../../../features/transactions/api/delete-transaction';
import { ImportDataDialog } from '@/features/import-data';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

export const DataSettingsPage = () => {
  const { t } = useTranslation(['common', 'settings']);
  const { openConfirmDialog } = useConfirmDialog();
  const { logout } = useAuth();
  const { deleteAllTransactions } = useDeleteTransaction(
    formatDateToYYYYMM(new Date()),
  );

  const handleDeleteAllTransaction = () => {
    openConfirmDialog({
      title: t('common:alert.are-you-sure'),
      message: t('settings:delete-transactions-modal.hint'),
      onConfirm: async () => {
        try {
          await deleteAllTransactions();
          toast({
            title: t('common:alert.deleted'),
            description: t(
              'settings:delete-transactions-modal.success-message',
            ),
          });
        } catch {
          toast({
            title: t('common:errors.operation-failed'),
            description: t(
              'settings:delete-transactions-modal.failure-message',
            ),
          });
        }
      },
    });
  };

  const handleDeleteAccount = () => {
    openConfirmDialog({
      title: t('settings:delete-account-modal.title'),
      message: t('settings:delete-account-modal.hint'),
      onConfirm: async () => {
        try {
          // TODO delete user account
          toast({
            title: t('common:alert.deleted'),
            description: t('settings.delete-account-modal.success-message'),
          });
          logout();
        } catch (error) {
          console.error('Error deleting account:', error);
          toast({
            title: t('common:errors.operation-failed'),
            description: t('settings.delete-account-modal.failure-message'),
          });
        }
      },
    });
  };

  return (
    <PageLayout
      title="My Data"
      backButtonProps={{
        url: SETTINGS_ROUTE,
        label: 'Settings',
      }}
    >
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

        <ListGroup title={t('settings:dangerous')}>
          <ListItem
            icon={
              <Trash2 className="h-4 w-4 text-red-600 dark:text-zinc-300" />
            }
            label={t('settings:delete-all-transactions')}
            onClick={handleDeleteAllTransaction}
            rightElement={undefined}
            variant="danger"
          />
          <ListItem
            icon={
              <Eraser className="h-4 w-4 text-red-600 dark:text-zinc-300" />
            }
            label={t('settings:erase-data')}
            rightElement={undefined}
            variant="danger"
          />
          <ListItem
            icon={<Skull className="h-4 w-4 text-red-600 dark:text-zinc-300" />}
            label={t('settings:delete-account')}
            rightElement={undefined}
            variant="danger"
            onClick={handleDeleteAccount}
          />
        </ListGroup>
      </div>
    </PageLayout>
  );
};
