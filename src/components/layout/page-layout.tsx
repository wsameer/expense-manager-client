import React, { ReactNode, ReactElement } from 'react';

import { useResponsive } from '@/hooks';

import { SidebarInset, SidebarProvider } from '../ui/sidebar';
import { AppSidebar } from '../navigation/sidebar/app-sidebar';
import { AppBottomBar } from '../navigation/bottombar/app-bottombar';
import { AppHeader, Head, MobileHeader } from '../seo';
import { cn } from '@/lib/utils';

interface PageLayoutProps {
  title?: string;
  subTitle?: string;
  children?: ReactNode;
  showStickyHeader?: boolean;
  rightElement?: ReactElement;
  backButtonUrl?: string;
}

export const PageLayout = React.memo<PageLayoutProps>((props) => {
  const { title, children } = props;
  const { isMobile } = useResponsive();
  return (
    <div className="flex flex-col sm:gap-2 md:pt-0">
      <SidebarProvider>
        <Head title={title} />
        <AppSidebar />
        <SidebarInset>
          {isMobile ? <MobileHeader {...props} /> : <AppHeader {...props} />}
          <div
            className={cn('flex flex-1 flex-col gap-4 p-4 pt-4 pb-24', {
              'pt-1': isMobile,
            })}
          >
            {children}
          </div>
        </SidebarInset>
        <AppBottomBar />
      </SidebarProvider>
    </div>
  );
});
