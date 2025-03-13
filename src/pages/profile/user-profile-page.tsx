import { PageLayout } from '@/components/layout/page-layout';
import { ContributionsTracker } from './components/contributions-chart';

export const UserProfilePage = () => {
  return (
    <PageLayout
      title="Profile"
      suppressStickyHeader
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
