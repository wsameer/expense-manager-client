import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MONTHS } from '../constant';
import { MonthData } from '..';

interface MonthButtonProps {
  monthData: MonthData;
  isSelected: boolean;
  onSelect: (year: number, month: number) => void;
}

export const MonthButton = ({
  monthData,
  isSelected,
  onSelect,
}: MonthButtonProps) => {
  const { month, year } = monthData;

  return (
    <Button
      variant="ghost"
      className={cn(
        'flex flex-col space-y-1 py-3 h-auto rounded-3xl',
        'hover:hover:text-background',
        {
          'bg-foreground/90 text-background hover:bg-foreground': isSelected,
        },
      )}
      onClick={() => onSelect(year, month)}
    >
      <p
        className={cn('text-sm text-center text-foreground font-medium', {
          'text-background': isSelected,
        })}
      >
        {MONTHS[month]}
      </p>
      <p
        className={cn(
          'text-xs text-center text-muted-foreground',
          isSelected && 'text-background',
        )}
      >
        {year}
      </p>
    </Button>
  );
};
