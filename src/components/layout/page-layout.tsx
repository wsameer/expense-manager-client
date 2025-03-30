import React, { ReactNode, ReactElement } from 'react';

import { useResponsive } from '@/hooks/use-responsive';

import { SidebarInset, SidebarProvider } from '../ui/sidebar';
import { AppSidebar } from '../navigation/sidebar/app-sidebar';
import { AppBottomBar } from '../navigation/bottombar/app-bottombar';
import { AppHeader, Head, MobileHeader } from '../seo';
import { AddTransaction } from '@/features/add-transaction';

export interface PageLayoutProps {
  title?: string;
  subTitle?: string;
  children?: ReactNode;
  suppressStickyHeader?: boolean;
  rightElement?: ReactElement;
  suppressTitle?: boolean;
  backButtonProps?: {
    url: string;
    label: string;
  };
}

export const PageLayout = React.memo<PageLayoutProps>((props) => {
  const { title, children } = props;
  const { isMobile } = useResponsive();

  return (
    <div className="flex flex-col sm:gap-2 md:pt-0">
      {isMobile ? (
        <div>
          <Head title={title} />
          <MobileHeader {...props} />
          <div className="flex gap-4 m-4 pb-8">{children}</div>
          <AppBottomBar />
        </div>
      ) : (
        <SidebarProvider>
          <Head title={title} />
          <AppSidebar />
          <SidebarInset>
            <AppHeader {...props} />
            <div className="flex gap-4 m-4 pb-8">
              {children}
              <AddTransaction />
            </div>
          </SidebarInset>
        </SidebarProvider>
      )}
    </div>
  );
});
