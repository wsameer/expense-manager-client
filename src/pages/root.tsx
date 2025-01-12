import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Outlet, useLocation } from 'react-router-dom';

import { Navigation } from '@/components/navigation';
import { Spinner } from '@/components/ui/spinner';
import { useResponsive } from '@/hooks';
import { AddTransaction } from '@/features/add-transaction';

export const AppRoot = () => {
  const location = useLocation();
  const { isMobile } = useResponsive();

  return (
    <div className="relative flex min-h-screen flex-col bg-muted/40">
      <Suspense
        fallback={
          <div className="flex size-full items-center justify-center">
            <Spinner size="xl" />
          </div>
        }
      >
        <ErrorBoundary
          key={location.pathname}
          fallback={<div>Something went wrong!</div>}
        >
          <Navigation />
          <Outlet />
          {!isMobile && <AddTransaction />}
        </ErrorBoundary>
      </Suspense>
    </div>
  );
};
