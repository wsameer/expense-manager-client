import { Link } from '../ui/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { PageLayoutProps } from '../layout/page-layout';

export const MobileHeader = ({
  title,
  subTitle,
  rightElement,
  backButtonProps,
  suppressStickyHeader = false,
  suppressTitle = false,
}: PageLayoutProps) => {
  if (suppressStickyHeader) {
    return <header className="h-8" />;
  }

  return (
    <header className="flex justify-between min-w-0 md:hidden px-4 pt-10">
      <div className="flex items-center gap-2">
        {backButtonProps?.url && (
          <Button
            size="icon"
            variant="outline"
            className="rounded-full text-foreground"
            asChild
          >
            <Link
              to={backButtonProps.url}
              className="h-8 w-8 text-lg [&_svg]:size-5"
            >
              <ChevronLeft />
            </Link>
          </Button>
        )}
        {!suppressTitle && (
          <div className="flex flex-col">
            <h2 className="text-3xl font-normal text-foreground tracking-tight">
              {title}
            </h2>
            {subTitle && (
              <p className="text-sm text-muted-foreground">{subTitle}</p>
            )}
          </div>
        )}
      </div>
      {rightElement && (
        <div className="flex-1 flex justify-end gap-1 text-right">
          {rightElement}
        </div>
      )}
    </header>
  );
};
