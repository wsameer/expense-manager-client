import { Settings } from '@/features/settings';
import { PageLayout } from '@/components/layout';

export const SettingsRoute = () => {
  return (
    <PageLayout title="Settings">
      <Settings />
    </PageLayout>
  );
};
