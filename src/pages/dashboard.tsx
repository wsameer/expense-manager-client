import { useState } from 'react';

import { PageLayout } from '@/components/layout';
import { useAuth, useResponsive } from '@/hooks';
import { cn } from '@/lib/utils';
import { MonthNavigator } from '@/components/shared/month-navigator';
import { DashboardPage } from '@/features/dashboard';

export const DashboardRoute = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { isDesktop } = useResponsive();
  const user = useAuth();
  console.log("🚀 ~ DashboardRoute ~ user:", user)


  const handleMonthChange = (year: number, month: number) => {
    setCurrentDate(new Date(year, month));
  };

  return (
    <PageLayout title="">
      <div
        className={cn('grid grid-cols-1 gap-3', {
          'w-1/3': isDesktop,
        })}
      >
        <MonthNavigator
          currentDate={currentDate}
          handleMonthChange={handleMonthChange}
          options={{ timeJump: true }}
        />
        <DashboardPage currentDate={currentDate} />
      </div>
    </PageLayout>
  );
};
