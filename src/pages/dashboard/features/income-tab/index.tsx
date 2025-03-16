import { Skeleton } from '@/components/ui/skeleton';
import { TabsContent } from '@/components/ui/tabs';
import { useChartData } from '../../api/get-chart-data';
import { TransactionType } from '@/types';
import { NoData } from '../../components/no-data';
import { useUiStore } from '@/store/uiStore';
import { formatDateToYYYYMM } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { ErrorMessage } from '@/components/errors/error-message';
import { CategoryItem } from '../category-item/category-item';
import { DashboardPieChart } from '../pie-chart';

export const IncomeTabContent = ({
  transactionType,
}: {
  transactionType: TransactionType;
}) => {
  const { selectedDate } = useUiStore();
  const month = formatDateToYYYYMM(selectedDate);

  const { pieChartData, error, isLoading } = useChartData(
    month,
    transactionType,
  );

  const totalAmount = pieChartData?.reduce(
    (acc, item) => acc + item.totalAmount,
    0,
  );

  if (error) {
    toast({
      title: error.code,
      description: error.message,
    });

    return <ErrorMessage message={error.message} />;
  }

  return (
    <TabsContent value={TransactionType.INCOME}>
      {isLoading && (
        <div className="flex items-center justify-center mt-8">
          <Skeleton className="h-40 w-40 rounded-full" />
        </div>
      )}
      {!isLoading && pieChartData!.length < 1 ? (
        <NoData />
      ) : (
        <>
          <DashboardPieChart chartData={pieChartData ?? []} />
          {pieChartData?.map((data, index) => (
            <CategoryItem
              key={data.id}
              data={data}
              index={index}
              totalAmount={totalAmount}
            />
          ))}
        </>
      )}
    </TabsContent>
  );
};
