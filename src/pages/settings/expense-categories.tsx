import { SETTINGS_ROUTE } from '@/app/router/routes';
import { PageLayout } from '@/components/layout/page-layout';
import { ExpenseCategoryList } from '@/features/expense-category/list';

export const ExpenseCategoriesSettingsPage = () => {
  return (
    <PageLayout
      title="Expense Categories"
      backButtonUrl={SETTINGS_ROUTE}
      suppressStickyHeader
    >
      <ExpenseCategoryList />
    </PageLayout>
  );
};
