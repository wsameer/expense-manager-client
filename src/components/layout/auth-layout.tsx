import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks';

import { APP_ROUTE } from '@/router/routes';
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
    <>
      <Head title={title} />
      <div className="flex min-h-screen flex-col justify-center bg-zinc-50 dark:bg-zinc-800 py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <BrandLogo size="large" />
          </div>
        </div>

        <div className="mt-8 px-4">{children}</div>
      </div>
    </>
  );
};
