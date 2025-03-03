import { PageLayout } from '@/components/layout/page-layout';
import { SETTINGS_ROUTE } from '@/router/routes';
import { IncomeCategoryList } from './list';

export const IncomeCategoriesSettings = () => {
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
