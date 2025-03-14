import { PageLayout } from '@/components/layout/page-layout';
import { ContributionsTracker } from './components/contributions-chart';
import { SETTINGS_ROUTE } from '@/app/router/routes';

export const UserProfilePage = () => {
  return (
    <PageLayout
      title="Profile"
      backButtonUrl={SETTINGS_ROUTE}
    >
      <div className="user-profile-container">
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
