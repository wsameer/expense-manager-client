import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';

interface MonthSelectorProps {
  currentDate?: Date;
  onSelectMonth: (year: number, month: number) => void;
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const MonthSelector: React.FC<MonthSelectorProps> = ({
  currentDate = new Date(),
  onSelectMonth,
}) => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const selectedMonth = currentDate.getMonth();

  const handlePreviousYear = () => {
    setSelectedYear((prev: number) => prev - 1);
  };

  const handleNextYear = () => {
    setSelectedYear((prev: number) => prev + 1);
  };

  const handleMonthClick = (monthIndex: number) => {
    // Check if the month is in the future
    if (selectedYear === currentYear && monthIndex > currentMonth) {
      return; // Do nothing for future months
    }
    onSelectMonth(selectedYear, monthIndex);
  };

  const getMonthStyle = (index: number): string => {
    if (
      selectedYear > currentYear ||
      (selectedYear === currentYear && index > currentMonth)
    ) {
      return 'bg-background/60 text-zinc-400 hover:text-zinc-400 hover:bg-background/60 cursor-not-allowed';
    }

    // Current month in current year
    if (selectedYear === currentYear && index === currentMonth) {
      // If it's also selected
      if (index === selectedMonth) {
        return 'bg-red-800 text-white hover:bg-red-900';
      }
      return 'bg-zinc-800 text-white hover:bg-zinc-900 border border-zinc-500';
    }

    // Selected month
    if (index === selectedMonth && selectedYear === currentDate.getFullYear()) {
      return 'bg-red-800 text-white hover:bg-red-900';
    }

    // Default state
    return 'bg-white dark:bg-zinc-800 dark:hover:bg-zinc-900';
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between gap-4 mb-2">
        <Button
          className="p-0"
          onClick={handlePreviousYear}
          variant={'ghost'}
        >
          <ChevronLeft size={20} />
        </Button>
        <span className="text-l font-semibold">{selectedYear}</span>
        <Button
          className="p-0"
          onClick={handleNextYear}
          variant={'ghost'}
        >
          <ChevronRight size={20} />
        </Button>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {MONTHS.map((month, index) => (
          <Button
            variant="ghost"
            key={month}
            onClick={() => handleMonthClick(index)}
            className={`
              p-2 border rounded-lg text-center text-xs transition-colors
              ${getMonthStyle(index)}
            `}
          >
            {month}
          </Button>
        ))}
      </div>
    </div>
  );
};
