import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks';

import { APP_ROUTE } from '@/app/router/routes';
import { Head } from '../seo';
import { BrandLogo } from '../navigation/brand-logo';

type LayoutProps = {
  children: React.ReactNode;
  title: string;
};

export const AuthLayout = ({ title, children }: LayoutProps) => {
  const { user } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(APP_ROUTE, {
        replace: true,
      });
    }
  }, [user, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-[400px]">
        <div className="flex flex-1 flex-col px-6 gap-10">
          <Head title={title} />

          <header className="flex justify-between items-center">
            <BrandLogo size="large" />
          </header>

          <main className="flex flex-1 flex-col gap-8">{children}</main>
        </div>
      </div>
    </div>
  );
};
