import { PageLayout } from '@/components/layout';
import React from 'react';

export const AccountsRoute = () => {
  return (
    <PageLayout
      title="Accounts"
      subTitle="Your accounts with its latest balance"
    >
      <AccountsPage />
    </PageLayout>
  );
};
