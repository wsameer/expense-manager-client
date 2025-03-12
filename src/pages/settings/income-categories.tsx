import { PageLayout } from '@/components/layout/page-layout';
import { IncomeCategoryList } from '@/features/income-categories/list';
import { SETTINGS_ROUTE } from '@/app/router/routes';

export const IncomeCategoriesSettingsPage = () => {
  return (
    <PageLayout
      title="Income Categories"
      backButtonUrl={SETTINGS_ROUTE}
      suppressStickyHeader
    >
      <IncomeCategoryList />
    </PageLayout>
  );
};
