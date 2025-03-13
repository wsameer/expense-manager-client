import { SETTINGS_ROUTE } from '@/app/router/routes';
import { PageLayout } from '@/components/layout/page-layout';
import { Button } from '@/components/ui/button';
import { Link } from '@/components/ui/link';
import { ExpenseCategoryList } from '@/features/expense-category/list';
import { ChevronLeft } from 'lucide-react';

export const ExpenseCategoriesSettingsPage = () => {
  return (
    <PageLayout
      title="Expense Categories"
      backButtonUrl={SETTINGS_ROUTE}
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
          Expense Categories
        </h2>
      </header>
      <ExpenseCategoryList />
    </PageLayout>
  );
};
