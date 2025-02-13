import { SETTINGS_ROUTE } from '@/router/routes';
import { PageLayout } from '@/components/layout/page-layout';
import { IncomeCategoryList } from '@/features/income-category/list';

export const IncomeCategoryRoute = () => {
  return (
    <PageLayout
      title="Income Categories"
      backButtonUrl={SETTINGS_ROUTE}
      showStickyHeader
    >
      <IncomeCategoryList />
    </PageLayout>
  );
};
