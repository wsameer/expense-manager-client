import { PageLayout } from '@/components/layout/page-layout';
import { MonthNavigator } from '@/components/shared/month-navigator';
import { useUiStore } from '@/store/uiStore';
import { useAuth } from '@/hooks/use-auth';
import { Dashboard } from '@/features/dashboard';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { selectedDate, setSelectedDate } = useUiStore();

  const handleMonthChange = (year: number, month: number) => {
    setSelectedDate(new Date(year, month));
  };

  return (
    <PageLayout
      suppressTitle
      title={user?.name}
      rightElement={
        <div className="flex justify-end overflow-hidden whitespace-nowrap bg-white border shadow-sm dark:bg-zinc-800 rounded-xl py-1">
          <MonthNavigator
            currentDate={selectedDate}
            handleMonthChange={handleMonthChange}
            className="justify-center gap-1"
          />
        </div>
      }
    >
      <div className="grid grid-cols-1 md:w-1/3">
        <div
          className="flex flex-col min-w-0 md:hidden"
          style={{ marginTop: '-4.1rem' }}
        >
          <p className="text-sm text-muted-foreground">Hello,</p>
          <h2 className="text-3xl font-normal text-foreground tracking-tight">
            {user?.name}
          </h2>
        </div>
        <Dashboard currentDate={selectedDate} />
      </div>
    </PageLayout>
  );
};
