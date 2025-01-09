import React from 'react';

interface CircularProgressBarProps {
  percentage: number;
  size?: number;
  strokeColor?: string;
  strokeWidth?: number;
  backgroundColor?: string;
  darkModeBackgroundColor?: string;
}

export const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
  percentage,
  size = 28,
  strokeColor,
  strokeWidth = 3,
}) => {
  const center = size / 2;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className="relative"
      style={{ width: size, height: size }}
    >
      <svg
        className="-rotate-90 w-full h-full"
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background Circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          className="stroke-current opacity-30"
          style={{ color: strokeColor }}
          strokeWidth={strokeWidth}
        />

        {/* Progress Circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          className="stroke-current"
          style={{ color: strokeColor }}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>

      {/* Percentage Text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <small
          className="text-center dark:text-white"
          style={{ fontSize: '8px' }}
        >
          {percentage}%
        </small>
      </div>
    </div>
  );
};
