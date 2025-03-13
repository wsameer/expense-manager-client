import { ScrollArea } from '@/components/ui/scroll-area';
import { getTotalDaysInCurrentYear } from '@/lib/utils';

interface MatrixTrackerProps {
  title: string;
  percentage: number;
  columns: number;
  filledCount: number;
}

export const ContributionsTracker = ({
  title = 'Day',
  percentage = 67,
  columns,
  filledCount,
}: MatrixTrackerProps) => {
  const totalDots = getTotalDaysInCurrentYear();
  const rows = Math.ceil(totalDots / columns);
  const filledDots = Math.min(filledCount, totalDots);

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white border dark:bg-zinc-800 rounded-2xl p-3 shadow-sm">
        <div className="flex justify-between mb-3">
          <h2 className="text-base font-bold">{title}</h2>
          <span className="text-base font-bold">{percentage}%</span>
        </div>
        <ScrollArea className="h-20 mb-3">
          <div
            className="grid gap-1 justify-items-center"
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(2px, 1fr))`,
              gridTemplateRows: `repeat(${rows}, 8px)`,
            }}
          >
            {Array.from({ length: totalDots }).map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full ${index < filledDots ? 'bg-foreground' : 'bg-zinc-200 dark:bg-zinc-600'}`}
              />
            ))}
          </div>
        </ScrollArea>
        <div className="flex items-center gap-1">
          <span className="text-sm font-bold">{filledCount}</span>
          <span className="text-sm text-muted-foreground">
            Consecutive Days of Contributing
          </span>
        </div>
      </div>
    </div>
  );
};
