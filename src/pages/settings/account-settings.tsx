import { PageLayout } from '@/components/layout/page-layout';
import { SETTINGS_ROUTE } from '@/router/routes';

export const AccountSettingsRoute = () => {
  return (
    <PageLayout
      title="Accounts"
      backButtonUrl={SETTINGS_ROUTE}
      showHeaderText
      showStickyHeader
    >
      <h1>Hello!</h1>
    </PageLayout>
  );
};
