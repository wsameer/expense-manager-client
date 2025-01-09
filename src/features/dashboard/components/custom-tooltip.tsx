import React from 'react';
import { TooltipProps } from 'recharts';

interface CustomTooltipProps extends TooltipProps<number, string> {
  showCategory?: boolean;
  showAmount?: boolean;
}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  showCategory = true,
  showAmount = true,
}) => {
  if (!active || !payload || payload.length === 0) return null;

  const { category, totalAmount } = payload[0].payload;

  return (
    <div className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-900 rounded-xl shadow-lg p-2 text-left">
      {showCategory && (
        <p className="text-xs font-semibold text-zinc-900 dark:text-white mb-1">
          {category}
        </p>
      )}
      {showAmount && (
        <small className="text-xs font-medium leading-none">
          $ {totalAmount.toLocaleString()}
        </small>
      )}
    </div>
  );
};
