import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MONTHS } from '../constant';
import { MonthData } from '../transactions-page';
interface MonthButtonProps {
  monthData: MonthData;
  isSelected: boolean;
  onClickHandler: (year: number, month: number) => void;
}

export const MonthButton = ({
  monthData,
  isSelected,
  onClickHandler,
}: MonthButtonProps) => {
  const { month, year } = monthData;

  return (
    <Button
      variant={isSelected ? 'default' : 'ghost'}
      className="flex flex-col py-4 h-auto rounded-3xl hover:text-background"
      onClick={() => onClickHandler(year, month)}
    >
      <p
        className={cn(
          'text-sm leading-3 text-center text-foreground font-medium',
          {
            'text-background': isSelected,
          },
        )}
      >
        {MONTHS[month]}
      </p>
      <p
        className={cn('text-center text-muted-foreground leading-3', {
          'text-background': isSelected,
        })}
        style={{ fontSize: '0.6rem' }}
      >
        {year}
      </p>
    </Button>
  );
};
