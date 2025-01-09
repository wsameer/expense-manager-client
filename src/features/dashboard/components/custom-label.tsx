import React from 'react';
import { COLORS } from '../constants';

export const CustomLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  percent,
  index,
  category,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
  category: string;
}) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 25;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const percentage = +(percent * 100).toFixed(0);

  return (
    <g>
      <text
        x={x}
        y={y - 10}
        fill={COLORS[index % COLORS.length]}
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${category.length > 14 ? `${category.slice(0, 14)}...` : category}`}
      </text>
      {percentage > 3 ? (
        <text
          x={x}
          y={y + 10}
          fill={COLORS[index % COLORS.length]}
          textAnchor={x > cx ? 'start' : 'end'}
          dominantBaseline="central"
          className="text-xs font-medium"
        >
          {`${percentage}%`}
        </text>
      ) : null}
      <path
        d={`M${cx},${cy}L${x},${y}`}
        stroke={COLORS[index % COLORS.length]}
        fill="none"
        className="opacity-70"
      />
    </g>
  );
};
