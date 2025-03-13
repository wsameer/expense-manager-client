import { PageLayout } from '@/components/layout/page-layout';
import { ContributionsTracker } from './components/contributions-chart';
import { Button } from '@/components/ui/button';
import { SETTINGS_ROUTE } from '@/app/router/routes';
import { Link } from '@/components/ui/link';
import { ChevronLeft } from 'lucide-react';

export const UserProfilePage = () => {
  return (
    <PageLayout
      title="Profile"
      suppressStickyHeader
    >
      <header className="flex gap-2 min-w-0 md:hidden">
        <Button
          className="rounded-full"
          size="icon"
          variant="outline"
          asChild
        >
          <Link to={SETTINGS_ROUTE}>
            <ChevronLeft />
          </Link>
        </Button>
        <h2 className="text-3xl font-normal text-foreground tracking-tight">
          Profile
        </h2>
      </header>

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
