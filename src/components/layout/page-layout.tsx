import { useResponsive } from '@/hooks';
import React, { ReactNode, ReactElement, useRef, useState, useEffect } from 'react'
import { AppHeader, Head, MobileHeader } from '../seo';
import { cn } from '@/lib/utils';

interface PageLayoutProps {
  title?: string;
  subTitle?: string;
  children?: ReactNode;
  showHeaderText?: boolean;
  rightElement?: ReactElement;
  backButton?: {
    url: string;
    title?: string;
  };
}

export const PageLayout = React.memo<PageLayoutProps>(
  ({
    title,
    children,
    subTitle,
    rightElement,
    showHeaderText = false,
    backButton,
  }) => {
    const { isMobile } = useResponsive();
    const pageTitleRef = useRef<HTMLDivElement>(null);
    const [showStickyHeader, setShowStickyHeader] = useState(showHeaderText);

    useEffect(() => {
      const handleScroll = () => {
        if (pageTitleRef.current) {
          // Get the distance from the top of the viewport to the bottom of the pageTitle element
          const titleBottom =
            pageTitleRef.current.getBoundingClientRect().bottom;

          // Adjust when to show the sticky header based on the header height
          const headerHeight = 58; // because h-14 is 56px
          setShowStickyHeader(titleBottom < headerHeight);
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, [showHeaderText]);

    return (
      <div className="flex flex-col sm:gap-2 md:pt-0 md:pl-14">
        <Head title={title} />
        {isMobile ? (
          <MobileHeader
            title={title}
            showStickyHeader={showStickyHeader}
            rightElement={rightElement}
            backButton={backButton}
          />
        ) : (
          <AppHeader />
        )}

        <main className="flex-1 overflow-y-auto">
          <div className="container pb-24">
            <div className="mx-auto w-full min-w-0">
              <div className="space-y-2">
                {!showHeaderText && (
                  <h1
                    ref={pageTitleRef}
                    className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl"
                    id="page-title"
                  >
                    {title}
                  </h1>
                )}
                {subTitle && (
                  <p className="text-sm text-muted-foreground">{subTitle}</p>
                )}
              </div>
              <div
                className={cn({
                  'pt-4': !showHeaderText,
                })}
              >
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  },
);