import { PageLayout } from '@/components/layout/page-layout';
import { cn } from '@/lib/utils';
import { MonthNavigator } from '@/components/shared/month-navigator';
import { useUiStore } from '@/store/uiStore';
import { useResponsive } from '@/hooks/use-responsive';
import { useAuth } from '@/hooks/use-auth';
import { Dashboard } from '@/features/dashboard';

export const DashboardPage = () => {
  const { isDesktop } = useResponsive();
  const { user } = useAuth();
  const { selectedDate, setSelectedDate } = useUiStore();

  const handleMonthChange = (year: number, month: number) => {
    setSelectedDate(new Date(year, month));
  };

  return (
    <PageLayout
      title={user?.name}
      suppressStickyHeader
    >
      <div
        className={cn('grid grid-cols-1 gap-4', {
          'w-2/4': isDesktop,
        })}
      >
        <header className="flex items-end justify-between gap-4">
          <div className="flex flex-col min-w-0 md:hidden">
            <p className="text-sm text-muted-foreground">Hello,</p>
            <h2 className="text-3xl font-normal text-foreground tracking-tight">
              {user?.name}
            </h2>
          </div>

          <div className="flex justify-end overflow-hidden whitespace-nowrap bg-white border shadow-sm dark:bg-zinc-800 rounded-xl py-1">
            <MonthNavigator
              currentDate={selectedDate}
              handleMonthChange={handleMonthChange}
              className="justify-center gap-1"
            />
          </div>
        </header>
        <Dashboard currentDate={selectedDate} />
      </div>
    </PageLayout>
  );
};
