import { PageLayout } from '@/components/layout/page-layout';
import { useAuth, useResponsive } from '@/hooks';
import { cn } from '@/lib/utils';
import { MonthNavigator } from '@/components/shared/month-navigator';
import { DashboardPage } from '@/features/dashboard';
import { useUiStore } from '@/store/uiStore';

export const DashboardRoute = () => {
  const { isDesktop } = useResponsive();
  const { user } = useAuth();
  const { selectedDate, setSelectedDate } = useUiStore();

  const handleMonthChange = (year: number, month: number) => {
    setSelectedDate(new Date(year, month));
  };

  return (
    <PageLayout
      title="Dashboard"
      suppressTitle
      showStickyHeader
    >
      <div
        className={cn('grid grid-cols-1 gap-3', {
          'w-2/4': isDesktop,
        })}
      >
        <div className="flex items-end justify-between gap-4 mb-2">
          {/* Left Side: Greeting Section (50%) */}
          <div className="flex flex-col min-w-0">
            <h2 className="text-2xl font-base text-foreground/40 tracking-tight">
              Hello,
            </h2>
            <h2 className="text-3xl font-base tracking-tight truncate max-w-[180px] sm:max-w-[240px]">
              {user?.name}
            </h2>
          </div>

          {/* Right Side: Month Navigator (50%) */}
          <div className="flex-none flex justify-end overflow-hidden whitespace-nowrap bg-white border shadow-sm dark:bg-zinc-800 rounded-xl py-1">
            <MonthNavigator
              currentDate={selectedDate}
              handleMonthChange={handleMonthChange}
              className="justify-center gap-1"
            />
          </div>
        </div>
        <DashboardPage currentDate={selectedDate} />
      </div>
    </PageLayout>
  );
};
