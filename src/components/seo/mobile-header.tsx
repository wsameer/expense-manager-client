import { ReactElement } from 'react';
import { Link } from '../ui/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '../ui/button';

type Props = {
  title?: string;
  backButtonUrl?: string;
  rightElement?: ReactElement;
  showStickyHeader?: boolean;
};

export const MobileHeader = ({
  title,
  rightElement,
  backButtonUrl,
  showStickyHeader = false,
}: Props) => {
  if (!showStickyHeader) {
    return <header className="h-14" />;
  }

  return (
    <header
      id="app-header-mobile"
      className="sticky top-0 z-50 w-full border-border/40 bg-background/15 backdrop-blur supports-[backdrop-filter]:bg-background/20"
    >
      <div className="container h-16 flex max-w-screen-2xl items-center">
        <div className="flex-1 text-left">
          {backButtonUrl && (
            <Button
              size="icon"
              variant="outline"
              className="rounded-full text-foreground"
              asChild
            >
              <Link to={backButtonUrl}>
                <ChevronLeft className="h-5 w-5" />
              </Link>
            </Button>
          )}
        </div>
        <div className="flex text-center">
          <p className="text-m font-bold leading-none">{title}</p>
        </div>
        <div className="flex-1 text-right">{rightElement}</div>
      </div>
    </header>
  );
};
