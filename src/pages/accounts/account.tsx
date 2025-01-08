import React from 'react';
import { Trash } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { toast } from '@/hooks';
import { ACCOUNTS_ROUTE } from '@/router/routes';
import { PageLayout } from '@/components/layout';
import { useConfirmDialog } from '@/components/ui/confirmable';
import { Button } from '@/components/ui/button';

export const AccountDetailsRoute = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { openConfirmDialog } = useConfirmDialog();
  const { deleteAccount } = useDeleteAccount();
  const { account } = useAccountById(id ?? null);

  const handleDeleteAccount = () => {
    if (!id) return;

    openConfirmDialog({
      title: t('alert.are-you-sure'),
      message: t('alert.this-action-cannot-be-undone'),
      onConfirm: async () => {
        try {
          await deleteAccount(id);
          toast({
            title: t('alert.deleted'),
            description: t('alert.your-account-has-been-deleted'),
          });
          navigate(ACCOUNTS_ROUTE);
        } catch (error) {
          console.error('Error deleting account:', error);
          toast({
            title: t('errors.operation-failed'),
            description: t('account.account-failed-to-delete'),
          });
        }
      },
    });
  };

  if (!id) {
    return (
      <PageLayout
        title={t('account.invalid-request')}
        showHeaderText={true}
        backButton={{ url: ACCOUNTS_ROUTE }}
      >
        <div className="grid justify-center">
          <p className="text-xl text-muted-foreground mt-72">
            {t('account.select-account-first')}
          </p>
        </div>
      </PageLayout>
    );
  }

  if (!account) {
    return (
      <PageLayout
        title={t('account.invalid-request')}
        showHeaderText={true}
        backButton={{ url: ACCOUNTS_ROUTE }}
      >
        <div className="grid justify-center">
          <p className="text-xl text-muted-foreground mt-72">
            {t('account.account-does-not-exist')}
          </p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={account.name}
      showHeaderText={true}
      backButton={{
        url: ACCOUNTS_ROUTE,
      }}
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
      <AccountDetails data={account} />
    </PageLayout>
  );
};
