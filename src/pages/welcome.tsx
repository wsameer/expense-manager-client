import React from 'react'
import { Github } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Head } from '@/components/seo/head'
import { Button } from '@/components/ui/button'
import { Link } from '@/components/ui/link'
import { LOGIN_ROUTE, DASHBOARD_ROUTE, APP_ROUTE } from '@/router/routes'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/hooks'

export const Welcome = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const { user } = useAuth();

  const handleStart = () => {
    if (user) {
      navigate(APP_ROUTE);
    } else {
      navigate(LOGIN_ROUTE);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Head title={t('welcome.title')} />
      <main className="flex h-screen items-center bg-white dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8 lg:py-16">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            {t('welcome.app-name')}
          </h1>
          <p className="mt-2 px-6 sm:px-2">{t('welcome.app-description')}</p>
          <div className="mt-8 flex justify-center">
            {user ? (
              <Button
                variant="default"
                asChild
              >
                <Link to={DASHBOARD_ROUTE}>{t('welcome.dashboard')}</Link>
              </Button>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button
                  variant="default"
                  asChild
                >
                  <Link to={LOGIN_ROUTE}>{t('welcome.login')}</Link>
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleStart}
                >
                  {t('welcome.get-started')}
                </Button>
                <a
                  href="https://github.com/wsameer/budget-tracker"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button variant="outline">
                    <Github className="mr-2 h-4 w-4" />{' '}
                    {t('welcome.github-repo')}
                  </Button>
                </a>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
