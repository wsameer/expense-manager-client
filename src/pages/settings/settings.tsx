import { Settings } from '@/features/settings';
import { PageLayout } from '@/components/layout/page-layout';

export const SettingsRoute = () => {
  return (
    <PageLayout title="Settings">
      <div className="flex flex-col min-w-0">
        <h2 className="text-3xl font-normal text-foreground tracking-tight">
          Settings
        </h2>
      </div>
      <Settings />
    </PageLayout>
  );
};
