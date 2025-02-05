import { Settings } from '@/features/settings';
import { PageLayout } from '@/components/layout/page-layout';

export const SettingsRoute = () => {
  return (
    <PageLayout title="Settings">
      <Settings />
    </PageLayout>
  );
};
