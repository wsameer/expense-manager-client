import { useState } from 'react';

import { Pie, Cell, PieChart, Sector } from 'recharts';
import { PieSectorDataItem } from 'recharts/types/polar/Pie';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from '@/components/ui/chart';
import { PieChartData } from '../../types';
import { COLORS } from '../../constants';
import { CustomTooltip } from './components/custom-tooltip';
import { CustomLabel } from './components/custom-label';

type Props = {
  chartData: Array<PieChartData>;
};

export const DashboardPieChart = ({ chartData }: Props) => {
  const [activePie, setActivePie] = useState<number>();
  const chartConfig = {
    amount: {
      label: 'Total Expense',
    },
    ...Object.fromEntries(
      chartData.map((entry, index) => [
        entry.category,
        { label: entry.category, color: COLORS[index % COLORS.length] },
      ]),
    ),
  } satisfies ChartConfig;

  const onPieEnter = (_: unknown, index: number) => setActivePie(index);

  const renderActiveShape = (props: PieSectorDataItem) => {
    const {
      cx,
      cy,
      innerRadius,
      outerRadius = 0,
      startAngle,
      endAngle,
      fill,
    } = props;
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  return (
    <div className="flex flex-col">
      <div className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto w-full h-[280px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <CustomTooltip
                  showCategory
                  showAmount
                />
              }
            />
            <Pie
              data={chartData}
              dataKey="totalAmount"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={80}
              animationDuration={400}
              label={CustomLabel}
              labelLine={false}
              activeIndex={activePie}
              activeShape={renderActiveShape}
              onClick={onPieEnter}
            >
              {chartData.map((_entry: unknown, index: number) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </div>
    </div>
  );
};
