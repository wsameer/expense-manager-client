import { Github, ScanFace } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Head } from '@/components/seo/head';
import { Button } from '@/components/ui/button';
import { Link } from '@/components/ui/link';
import {
  LOGIN_ROUTE,
  DASHBOARD_ROUTE,
  APP_ROUTE,
  REGISTER_ROUTE,
} from '@/router/routes';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks';
import { BrandLogo } from '@/components/navigation/brand-logo';
import React from 'react';

export const Welcome = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const { user } = useAuth();

  const handleStart = () => {
    if (user) {
      navigate(APP_ROUTE);
    } else {
      navigate(REGISTER_ROUTE);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-background">
      <div className="relative flex h-screen w-full max-w-[400px] flex-col justify-between bg-background">
        <div className="flex flex-1 flex-col px-6 mt-14">
          <Head />

          <main className="flex flex-1 flex-col gap-24 md:gap-12 md:justify-center">
            <div className="">
              <BrandLogo size="large" />
            </div>

            <section className="space-y-4">
              <h1 className="text-5xl font-light leading-tight text-zinc-900 dark:text-white">
                {'Track.\nSave.\nGrow.\nEffortlessly.'
                  .split('\n')
                  .map((text, i) => (
                    <React.Fragment key={i}>
                      {text}
                      <br />
                    </React.Fragment>
                  ))}
              </h1>

              <p className="text-xl font-light text-zinc-400">
                Welcome to new era of managing your expenses
              </p>
            </section>

            <div className="absolute p-6 bottom-6 left-0 right-0 space-y-4 bg-background md:relative md:px-0">
              {user ? (
                <Button
                  className="flex-1 w-full rounded-full h-12 text-lg"
                  asChild
                >
                  <Link to={DASHBOARD_ROUTE}>{t('welcome.dashboard')}</Link>
                </Button>
              ) : (
                <>
                  <div className="flex gap-4">
                    <Button
                      variant="default"
                      className="flex-1 rounded-full h-12 text-lg"
                      asChild
                    >
                      <Link to={LOGIN_ROUTE}>{t('welcome.login')}</Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="rounded-full h-12 w-12"
                    >
                      <ScanFace className="h-6 w-6" />
                      <span className="sr-only">Face ID</span>
                    </Button>
                  </div>
                  <div className="flex gap-4">
                    <a
                      href="https://github.com/wsameer/expense-manager-server"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Button
                        size="icon"
                        className="rounded-full h-12 w-12"
                      >
                        <Github className="h-6 w-6" />
                        <span className="sr-only">
                          {t('welcome.github-repo')}
                        </span>
                      </Button>
                    </a>
                    <Button
                      className="flex-1 rounded-full h-12 text-lg"
                      variant="destructive"
                      onClick={handleStart}
                    >
                      {t('welcome.get-started')}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
