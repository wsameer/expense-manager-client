import React from 'react';

import { SETTINGS_ROUTE } from '@/router/routes';
import { DataSettings } from '@/features/settings/data-settings';
import { PageLayout } from '@/components/layout';

export const DataSettingsRoute = () => {
  return (
    <PageLayout
      title="My Data"
      showHeaderText={true}
      backButton={{
        url: SETTINGS_ROUTE,
        title: 'Settings',
      }}
    >
      <DataSettings />
    </PageLayout>
  );
};
