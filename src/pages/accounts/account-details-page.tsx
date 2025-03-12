import { Trash } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { toast } from '@/hooks/use-toast';
import { ACCOUNTS_ROUTE } from '@/app/router/routes';
import { PageLayout } from '@/components/layout/page-layout';
import { useConfirmDialog } from '@/components/ui/confirmable';
import { Button } from '@/components/ui/button';
import { useDeleteAccount } from '@/features/accounts/api/delete-account';
import { useAccountById } from '@/features/accounts/api/get-account';
import { EditAccount } from '@/features/accounts/components/edit-account';
import { AccountDetails } from '@/features/accounts/components/account-details';

export const AccountDetailsPage = () => {
  const { id } = useParams();
  const { t } = useTranslation(['common', 'account']);
  const navigate = useNavigate();
  const { openConfirmDialog } = useConfirmDialog();
  const { deleteAccount } = useDeleteAccount();
  const { account } = useAccountById(id ?? null);

  const handleDeleteAccount = () => {
    if (!id) return;

    openConfirmDialog({
      title: t('common:alert.are-you-sure'),
      message: t('common:alert.this-action-cannot-be-undone'),
      onConfirm: async () => {
        try {
          await deleteAccount(id);
          toast({
            title: t('common:alert.deleted'),
            description: t('common:alert.your-account-has-been-deleted'),
          });
          navigate(ACCOUNTS_ROUTE);
        } catch (error) {
          console.error('Error deleting account:', error);
          toast({
            title: t('common:errors.operation-failed'),
            description: t('common:account.account-failed-to-delete'),
          });
        }
      },
    });
  };

  if (!id) {
    return (
      <PageLayout
        title={t('account:invalid-request')}
        backButtonUrl={ACCOUNTS_ROUTE}
      >
        <div className="grid justify-center">
          <p className="text-xl text-muted-foreground mt-72">
            {t('account:select-account-first')}
          </p>
        </div>
      </PageLayout>
    );
  }

  if (!account) {
    return (
      <PageLayout
        title={t('account:invalid-request')}
        backButtonUrl={ACCOUNTS_ROUTE}
      >
        <div className="grid justify-center">
          <p className="text-xl text-muted-foreground mt-72">
            {t('account:account-does-not-exist')}
          </p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={account.name}
      backButtonUrl={ACCOUNTS_ROUTE}
      rightElement={
        <div className="d-flex">
          <Button
            variant="ghost"
            className="text-red-600 hover:text-red-700"
            size="sm"
            onClick={handleDeleteAccount}
          >
            <Trash className="h-4 w-4" />
          </Button>
          <EditAccount
            group={account.group}
            name={account.name}
            paymentAccountId={account.paymentAccountId ?? undefined}
            description={account.description}
            balance={account.balance}
            accountId={account.id}
          />
        </div>
      }
    >
      <AccountDetails />
    </PageLayout>
  );
};
