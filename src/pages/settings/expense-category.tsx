import React from 'react';
import { SETTINGS_ROUTE } from '@/router/routes';
import { PageLayout } from '@/components/layout';

export const ExpenseCategoryRoute = () => {
  return (
    <PageLayout
      title="Expense Categories"
      showHeaderText={true}
      backButton={{
        url: SETTINGS_ROUTE,
        title: 'Settings',
      }}
    >
      <ExpenseCategoryList />
    </PageLayout>
  );
};
