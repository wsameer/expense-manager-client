import { SETTINGS_ROUTE } from '@/router/routes';
import { PageLayout } from '@/components/layout/page-layout';
import { ExpenseCategoryList } from '@/features/expense-category/list';

export const ExpenseCategoryRoute = () => {
  return (
    <PageLayout
      title="Expense Categories"
      backButtonUrl={SETTINGS_ROUTE}
      showStickyHeader
    >
      <ExpenseCategoryList />
    </PageLayout>
  );
};
