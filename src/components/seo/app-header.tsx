import { Search, Slash } from 'lucide-react';
import { NavLink } from 'react-router-dom';

import { Input } from '@/components/ui/input';
import { ModeToggle } from '@/features/theme/mode-toggle';
import { SidebarTrigger } from '../ui/sidebar';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import { PageLayoutProps } from '../layout/page-layout';

export const AppHeader = ({
  backButtonProps,
  subTitle,
  title,
}: PageLayoutProps) => {
  return (
    <header
      className="hidden md:flex h-16 w-full items-center justify-between gap-2 sticky top-0 z-30 bg-background px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
      id="app-header-desktop"
    >
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="h-4"
        />
        {backButtonProps?.url && (
          <>
            <Button
              className="text-xl font-medium tracking-tight p-0"
              variant="link"
              asChild
            >
              <NavLink to={backButtonProps.url}>
                {backButtonProps.label}
              </NavLink>
            </Button>
            <Slash className="h-4" />
          </>
        )}
        <div className="flex flex-col min-w-0">
          <h2 className="text-xl font-medium tracking-tight truncate max-w-[180px] sm:max-w-[240px]">
            {title}
          </h2>
          <small className="text-foreground/50">{subTitle}</small>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-[200px] lg:w-[336px] rounded-xl bg-background pl-8"
          />
        </div>
        <ModeToggle />
      </div>
    </header>
  );
};
