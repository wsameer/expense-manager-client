import { ReactElement } from 'react';
import { Link } from '../ui/link';
import { Bell, ChevronLeft, Wallet2 } from 'lucide-react';
import { Button } from '../ui/button';
import { SETTINGS_ROUTE } from '@/app/router/routes';
import { Avatar } from '../ui/avatar';
import { AvatarFallback } from '@radix-ui/react-avatar';

type Props = {
  title?: string;
  backButtonUrl?: string;
  rightElement?: ReactElement;
  suppressStickyHeader?: boolean;
  suppressTitle?: boolean;
};

export const MobileHeader = ({
  title,
  rightElement,
  backButtonUrl,
  suppressStickyHeader = false,
  suppressTitle = false,
}: Props) => {
  if (suppressStickyHeader) {
    return <header className="h-8" />;
  }

  return (
    <header
      id="app-header-mobile"
      className="sticky top-0 z-50 w-full border-border/40 bg-background/15 backdrop-blur supports-[backdrop-filter]:bg-background/20"
    >
      <div className="container h-16 flex max-w-screen-2xl items-center">
        <div className="flex-1 text-left">
          {backButtonUrl ? (
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
          ) : (
            <Wallet2 className="h-5 w-5" />
          )}
        </div>
        {!suppressTitle && (
          <div className="flex text-center">
            <p className="text-m font-bold leading-none">{title}</p>
          </div>
        )}
        <div className="flex-1 flex justify-end gap-1 text-right">
          {rightElement}
          <Button
            className="rounded-full"
            variant="ghost"
            size="icon"
          >
            <Bell />
          </Button>
          <Button
            className="rounded-full"
            size="icon"
            variant="outline"
            asChild
          >
            <Link to={SETTINGS_ROUTE}>
              <Avatar className="w-auto h-auto">
                <AvatarFallback>ST</AvatarFallback>
              </Avatar>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};
