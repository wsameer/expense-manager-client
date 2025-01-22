import { PageLayout } from "@/components/layout";
import { SETTINGS_ROUTE } from "@/router/routes";

export const AccountSettingsRoute = () => {
  return (
    <PageLayout
      title="Accounts"
      showHeaderText={true}
      backButton={{
        url: SETTINGS_ROUTE,
        title: 'Settings',
      }}
    >
      <h1>Hello!</h1>
    </PageLayout>
  );
};
