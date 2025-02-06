import { ReactElement } from 'react';
import { Link } from '../ui/link';
import { ChevronLeft } from 'lucide-react';

type Props = {
  title?: string;
  showStickyHeader?: boolean;
  backButtonUrl?: string;
  rightElement?: ReactElement;
};

export const MobileHeader = ({
  title,
  showStickyHeader,
  rightElement,
  backButtonUrl,
}: Props) => (
  <header
    id="app-header-mobile"
    className="sticky top-0 h-14 z-50 w-full border-border/40 bg-background/15 backdrop-blur supports-[backdrop-filter]:bg-background/20"
  >
    {showStickyHeader ? (
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="flex-1 text-left">
          {backButtonUrl && (
            <Link
              to={backButtonUrl}
              className="gap-0 text-foreground hover:bg-red-900"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
          )}
        </div>
        <div className="flex text-center">
          <p className="text-m font-bold leading-none">{title}</p>
        </div>
        <div className="flex-1 text-right">{rightElement}</div>
      </div>
    ) : null}
  </header>
);
