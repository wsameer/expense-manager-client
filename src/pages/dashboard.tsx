import { useState } from 'react';

import { PageLayout } from '@/components/layout/page-layout';
import { useAuth, useResponsive } from '@/hooks';
import { cn } from '@/lib/utils';
import { MonthNavigator } from '@/components/shared/month-navigator';
import { DashboardPage } from '@/features/dashboard';

export const DashboardRoute = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { isDesktop } = useResponsive();
  const { user } = useAuth();

  const handleMonthChange = (year: number, month: number) => {
    setCurrentDate(new Date(year, month));
  };

  return (
    <PageLayout title="Dashboard">
      <div
        className={cn('grid grid-cols-1 gap-3', {
          'w-3/4': isDesktop,
        })}
      >
        <div className="flex items-end justify-between gap-4 mb-2">
          {/* Left Side: Greeting Section (50%) */}
          <div className="flex flex-col min-w-0">
            <h2 className="text-3xl font-normal text-foreground/40 tracking-tight">
              Hello,
            </h2>
            <h2 className="text-3xl sm:text-3xl font-semibold tracking-tight truncate max-w-[180px] sm:max-w-[240px]">
              {user?.name}
            </h2>
          </div>

          {/* Right Side: Month Navigator (50%) */}
          <div className="flex-none flex justify-end overflow-hidden whitespace-nowrap bg-white border shadow-sm dark:bg-zinc-800 rounded-2xl py-1">
            <MonthNavigator
              currentDate={currentDate}
              handleMonthChange={handleMonthChange}
              options={{ timeJump: true }}
              className="justify-center gap-1"
            />
          </div>
        </div>
        <DashboardPage currentDate={currentDate} />
      </div>
    </PageLayout>
  );
};
