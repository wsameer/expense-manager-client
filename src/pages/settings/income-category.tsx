import React from 'react';
import { SETTINGS_ROUTE } from '@/router/routes';
import { PageLayout } from '@/components/layout';

export const IncomeCategoryRoute = () => {
  return (
    <PageLayout
      title="Income Categories"
      showHeaderText={true}
      backButton={{
        url: SETTINGS_ROUTE,
        title: 'Settings',
      }}
    >
      <IncomeCategoryList />
    </PageLayout>
  );
};
