import { PageLayout } from '@/components/layout/page-layout';
import { AccountsPage } from '@/features/accounts';

export const AccountsRoute = () => {
  return (
    <PageLayout
      title="Accounts"
      subTitle="Your accounts with its latest balance"
    >
      <div className="md:hidden flex flex-col min-w-0">
        <h2 className="text-3xl font-normal text-foreground tracking-tight">
          Accounts
        </h2>
        <p className="text-sm text-muted-foreground">
          Your accounts with its latest balance
        </p>
      </div>
      <AccountsPage />
    </PageLayout>
  );
};
