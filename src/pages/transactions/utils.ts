import { MONTH_RANGE } from './constant';
import { MonthData } from './transactions-page';

export const getMonthsToDisplay = (date: Date): MonthData[] => {
  const currentMonth = date.getMonth();
  const currentYear = date.getFullYear();

  return MONTH_RANGE.map((offset) => {
    const month = (currentMonth + offset + 12) % 12;
    const year = currentYear + Math.floor((currentMonth + offset) / 12);
    return { month, year };
  });
};
