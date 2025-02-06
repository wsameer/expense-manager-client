import { SETTINGS_ROUTE } from '@/router/routes';
import { DataSettings } from '@/features/settings/data-settings';
import { PageLayout } from '@/components/layout/page-layout';

export const DataSettingsRoute = () => {
  return (
    <PageLayout
      title="My Data"
      backButtonUrl={SETTINGS_ROUTE}
      showHeaderText
      showStickyHeader
    >
      <DataSettings />
    </PageLayout>
  );
};
