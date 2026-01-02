import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { HelmetProvider } from 'react-helmet-async';

import { MainErrorFallback } from '@/components/errors';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Spinner } from '@/components/ui/spinner';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/features/auth/auth-provider';
import { ConfirmDialogProvider } from '@/components/ui/confirmable';

type AppProviderProps = {
  children: React.ReactNode;
};

const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <ErrorBoundary FallbackComponent={MainErrorFallback}>
      <React.Suspense
        fallback={
          <div className="flex h-screen w-screen items-center justify-center">
            <Spinner size="xl" />
          </div>
        }
      >
        <HelmetProvider>
          <TooltipProvider>
            <AuthProvider>
              <ConfirmDialogProvider>
                <Toaster />
                {children}
              </ConfirmDialogProvider>
            </AuthProvider>
          </TooltipProvider>
        </HelmetProvider>
      </React.Suspense>
    </ErrorBoundary>
  );
};

export default AppProvider;
