import { PageLayout } from '@/components/layout/page-layout';
import { SETTINGS_ROUTE } from '@/app/router/routes';

export const AccountSettingsPage = () => {
  return (
    <PageLayout
      title="Accounts"
      backButtonProps={{
        url: SETTINGS_ROUTE,
        label: 'Settings',
      }}
    >
      <h1>Hello!</h1>
    </PageLayout>
  );
};
