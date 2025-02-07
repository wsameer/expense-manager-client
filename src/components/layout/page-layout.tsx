import React, { ReactNode, ReactElement } from 'react';

import { useResponsive } from '@/hooks';

import { SidebarInset, SidebarProvider } from '../ui/sidebar';
import { AppSidebar } from '../navigation/sidebar/app-sidebar';
import { AppBottomBar } from '../navigation/bottombar/app-bottombar';
import { AppHeader, Head, MobileHeader } from '../seo';

interface PageLayoutProps {
  title?: string;
  subTitle?: string;
  children?: ReactNode;
  showHeaderText?: boolean;
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
        <AppBottomBar />
        <SidebarInset>
          {isMobile ? <MobileHeader {...props} /> : <AppHeader {...props} />}
          <div className="flex flex-1 flex-col gap-4 p-4 pt-4 pb-24">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
});
