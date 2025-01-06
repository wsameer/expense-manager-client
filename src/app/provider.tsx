import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { HelmetProvider } from 'react-helmet-async';

import { MainErrorFallback } from '@/components/errors';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Spinner } from '@/components/ui/spinner';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/features/auth/auth-provider';

type AppProviderProps = {
  children: React.ReactNode;
};

const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <React.Suspense
      fallback={<div className="flex h-screen w-screen items-center justify-center" >
        <Spinner size="xl" />
      </div>}
    >
      <ErrorBoundary FallbackComponent={MainErrorFallback}>
        <HelmetProvider>
          <TooltipProvider>
            <AuthProvider>
              <Toaster />
              {children}
            </AuthProvider>
          </TooltipProvider>
        </HelmetProvider>
      </ErrorBoundary>
    </React.Suspense>
  );
};

export default AppProvider;
