import { PageLayout } from '@/components/layout/page-layout';
import { MonthNavigator } from '@/components/shared/month-navigator';
import { useUiStore } from '@/store/uiStore';
import { useAuth } from '@/hooks/use-auth';
import { useResponsive } from '@/hooks/use-responsive';
import { capitalize, cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { TransactionType } from '@/types';
import { ExpenseTabContent } from './features/expense-tab';
import { IncomeTabContent } from './features/income-tab';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { isDesktop } = useResponsive();
  const { selectedDate, setSelectedDate } = useUiStore();

  const [transactionType, setTransactionType] = useState<TransactionType>(
    TransactionType.EXPENSE,
  );

  const handleMonthChange = (year: number, month: number) => {
    setSelectedDate(new Date(year, month));
  };

  const handleTabChange = (value: string) => {
    setTransactionType(value as TransactionType);
  };

  return (
    <PageLayout
      suppressTitle
      title={'Dashboard'}
      suppressStickyHeader
    >
      <div
        className={cn('grid grid-cols-1 gap-4', {
          'w-2/5': isDesktop,
        })}
      >
        <div className="flex justify-between items-end">
          <div className="flex flex-col min-w-0">
            <p className="text-sm text-muted-foreground">Hello,</p>
            <h2 className="text-3xl font-normal text-foreground tracking-tight">
              {user?.name}
            </h2>
          </div>
          <div className="rounded-xl py-1 border">
            <MonthNavigator
              currentDate={selectedDate}
              handleMonthChange={handleMonthChange}
              className="justify-center gap-1"
            />
          </div>
        </div>

        <Tabs
          defaultValue={TransactionType.EXPENSE}
          onValueChange={handleTabChange}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value={TransactionType.INCOME}>
              {capitalize(TransactionType.INCOME)}
            </TabsTrigger>
            <TabsTrigger value={TransactionType.EXPENSE}>
              {capitalize(TransactionType.EXPENSE)}
            </TabsTrigger>
          </TabsList>
          <ExpenseTabContent transactionType={transactionType} />
          <IncomeTabContent transactionType={transactionType} />
        </Tabs>
      </div>
    </PageLayout>
  );
};
