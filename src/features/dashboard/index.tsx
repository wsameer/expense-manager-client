import { memo, useState } from 'react';

import { Card } from '@/components/ui/card';
import { TransactionType } from '@/types';
import { CAD } from '@/lib/constants';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { capitalize, formatDateToYYYYMM } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { ErrorMessage } from '@/components/errors/error-message';
import { useChartData } from './api/get-chart-data';
import { DashboardPieChart } from './components/pie-chart';
import { COLORS } from './constants';
import { CircularProgressBar } from './components/circular-progressbar';
import { NoData } from './components/no-data';

type Props = {
  currentDate: Date;
};

export const Dashboard = memo(({ currentDate }: Props) => {
  const [transactionType, setTransactionType] = useState<TransactionType>(
    TransactionType.EXPENSE,
  );

  const month = formatDateToYYYYMM(currentDate);

  const { pieChartData, error, isLoading } = useChartData(
    month,
    transactionType,
  );

  const totalAmount = pieChartData?.reduce(
    (acc, item) => acc + item.totalAmount,
    0,
  );

  const handleTabChange = (value: string) => {
    setTransactionType(value as TransactionType);
  };

  const renderNoData = () => <NoData />;

  const renderCategoryList = () => {
    return pieChartData?.map((data, index) => {
      const percentage = Number.parseInt(
        ((data.totalAmount / (totalAmount ?? 100)) * 100).toFixed(0),
      );
      return (
        <Card
          key={data.id}
          className="flex justify-between shadow-none items-center bg-background rounded-2xl px-4 py-2 mb-2"
        >
          <div className="flex items-center gap-2">
            <CircularProgressBar
              strokeColor={COLORS[index % COLORS.length]}
              percentage={percentage}
              strokeWidth={2}
              fontSize={percentage > 99 ? 7 : 9}
            />
            <small className="text-foreground text-sm font-medium">
              {data.category}
            </small>
          </div>
          <small className="text-foreground text-sm">
            {CAD.format(data.totalAmount)}
          </small>
        </Card>
      );
    });
  };

  if (error) {
    toast({
      title: error.code,
      description: error.message,
    });

    return <ErrorMessage message={error.message} />;
  }

  return (
    <div>
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
        <TabsContent value={TransactionType.EXPENSE}>
          {isLoading && (
            <div className="flex items-center justify-center mt-8">
              <Skeleton className="h-40 w-40 rounded-full" />
            </div>
          )}
          {!isLoading && pieChartData!.length < 1 ? (
            renderNoData()
          ) : (
            <>
              <DashboardPieChart chartData={pieChartData ?? []} />
              {renderCategoryList()}
            </>
          )}
        </TabsContent>
        <TabsContent value={TransactionType.INCOME}>
          {isLoading && (
            <div className="flex items-center justify-center mt-8">
              <Skeleton className="h-40 w-40 rounded-full" />
            </div>
          )}
          {!isLoading && pieChartData!.length < 1 ? (
            renderNoData()
          ) : (
            <>
              <DashboardPieChart chartData={pieChartData ?? []} />
              {renderCategoryList()}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
});

Dashboard.displayName = 'Dashboard';
