import { SETTINGS_ROUTE } from '@/router/routes';
import { PageLayout } from '@/components/layout';
import { ExpenseCategoryList } from '@/features/expense-category/list';

export const ExpenseCategoryRoute = () => {
  return (
    <PageLayout
      title="Expense Categories"
      showHeaderText={true}
      backButton={{
        url: SETTINGS_ROUTE,
        title: 'Settings',
      }}
    >
      <ExpenseCategoryList />
    </PageLayout>
  );
};
