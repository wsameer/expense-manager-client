import { SETTINGS_ROUTE } from '@/app/router/routes';
import { PageLayout } from '@/components/layout/page-layout';
import { ExpenseCategoryList } from '@/features/expense-category/list';

export const ExpenseCategoriesSettingsPage = () => {
  return (
    <PageLayout
      title="Expense Categories"
      backButtonProps={{
        url: SETTINGS_ROUTE,
        label: 'Settings',
      }}
    >
      <ExpenseCategoryList />
    </PageLayout>
  );
};
