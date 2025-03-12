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
      title="Dashboard"
      suppressStickyHeader
    >
      <div
        className={cn('grid grid-cols-1 gap-3', {
          'w-2/4': isDesktop,
        })}
      >
        <div className="flex items-end justify-between gap-4 mb-2">
          <div className="flex flex-col min-w-0">
            <h2 className="text-2xl font-base text-foreground/40 tracking-tight">
              Hello,
            </h2>
            <h2 className="text-3xl font-base tracking-tight truncate max-w-[180px] sm:max-w-[240px]">
              {user?.name.split(' ')[0]}
            </h2>
          </div>

          <div className="flex-none flex justify-end overflow-hidden whitespace-nowrap bg-white border shadow-sm dark:bg-zinc-800 rounded-xl py-1">
            <MonthNavigator
              currentDate={selectedDate}
              handleMonthChange={handleMonthChange}
              className="justify-center gap-1"
            />
          </div>
        </div>
        <Dashboard currentDate={selectedDate} />
      </div>
    </PageLayout>
  );
};
