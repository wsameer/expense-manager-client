import { SETTINGS_ROUTE } from '@/router/routes';
import { PageLayout } from '@/components/layout';
import { IncomeCategoryList } from '@/features/income-category/list';

export const IncomeCategoryRoute = () => {
  return (
    <PageLayout
      title="Income Categories"
      showHeaderText={true}
      backButton={{
        url: SETTINGS_ROUTE,
        title: 'Settings',
      }}
    >
      <IncomeCategoryList />
    </PageLayout>
  );
};
