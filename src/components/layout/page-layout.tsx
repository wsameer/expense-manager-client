import React, { ReactNode, ReactElement } from 'react';

import { useResponsive } from '@/hooks/use-responsive';

import { SidebarInset, SidebarProvider } from '../ui/sidebar';
import { AppSidebar } from '../navigation/sidebar/app-sidebar';
import { AppBottomBar } from '../navigation/bottombar/app-bottombar';
import { AppHeader, Head } from '../seo';
import { cn } from '@/lib/utils';
import { AddTransaction } from '@/features/add-transaction';

interface PageLayoutProps {
  title?: string;
  subTitle?: string;
  children?: ReactNode;
  suppressStickyHeader?: boolean;
  rightElement?: ReactElement;
  suppressTitle?: boolean;
  backButtonUrl?: string;
}

export const PageLayout = React.memo<PageLayoutProps>((props) => {
  const { title, children } = props;
  const { isMobile } = useResponsive();

  return (
    <div className="flex flex-col sm:gap-2 md:pt-0">
      <SidebarProvider>
        <Head title={title} />

        {!isMobile && <AppSidebar />}

        <SidebarInset>
          {!isMobile && <AppHeader {...props} />}
          <div
            className={cn('flex flex-1 flex-col gap-4 p-4 pt-4 my-8', {
              'pt-1 pb-16': isMobile,
            })}
          >
            {children}
            {!isMobile && <AddTransaction />}
          </div>
        </SidebarInset>

        {isMobile && <AppBottomBar />}
      </SidebarProvider>
    </div>
  );
});
