import { PageLayout } from '@/components/layout/page-layout';
import { SETTINGS_ROUTE } from '@/app/router/routes';

export const AccountSettingsPage = () => {
  return (
    <PageLayout
      title="Accounts"
      backButtonUrl={SETTINGS_ROUTE}
    >
      <h1>Hello!</h1>
    </PageLayout>
  );
};
