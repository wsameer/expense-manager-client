import { Card } from '@/components/ui/card';
import { CircularProgressBar } from './components/circular-progressbar';
import { PieChartData } from '../../types';
import { CAD } from '@/lib/constants';
import { COLORS } from '../../constants';

type Props = {
  index: number;
  data: PieChartData;
  totalAmount: number;
};
export const CategoryItem = ({ data, index, totalAmount }: Props) => {
  const percentage = Number.parseInt(
    ((data.totalAmount / (totalAmount ?? 100)) * 100).toFixed(0),
  );

  return (
    <Card className="flex justify-between shadow-none items-center bg-background rounded-2xl px-4 py-2 mb-2">
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
};
