import { PageLayout } from '@/components/layout/page-layout';
import { ContributionsTracker } from './components/contributions-chart';
import { SETTINGS_ROUTE } from '@/app/router/routes';

export const UserProfilePage = () => {
  return (
    <PageLayout
      title="Profile"
      backButtonProps={{
        url: SETTINGS_ROUTE,
        label: 'Settings',
      }}
    >
      <div className="md:w-1/3">
        <ContributionsTracker
          title={`Contributions in ${new Date().getFullYear()}`}
          percentage={30}
          columns={28}
          filledCount={44}
        />
      </div>
    </PageLayout>
  );
};
