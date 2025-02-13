import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { APP_ROUTE, REGISTER_ROUTE } from '@/router/routes';
import { useTranslation } from 'react-i18next';
import { AuthLayout } from '@/components/layout/auth-layout';
import { LoginForm } from '@/features/auth/login-form';
import { Button } from '@/components/ui/button';
import { Github, ScanFace } from 'lucide-react';

export const LoginRoute = () => {
  const { t } = useTranslation('auth', { keyPrefix: 'forms' });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');

  return (
    <AuthLayout title={t('login')}>
      <div>
        <h1 className="text-4xl font-light text-zinc-900 dark:text-white">
          {t('welcome-back')}
        </h1>
        <p className="text-lg font-light text-zinc-400 mt-2">
          {t('your-email-address')}
        </p>
      </div>

      <LoginForm
        onSuccess={() =>
          navigate(`${redirectTo ? `${redirectTo}` : APP_ROUTE}`, {
            replace: true,
          })
        }
      />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-zinc-500">
            Or continue with
          </span>
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          variant="outline"
          size="icon"
          className="flex-1 rounded-full h-12"
        >
          <Github className="h-6 w-6" />
          <span className="sr-only">GitHub</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="flex-1 rounded-full h-12"
        >
          <ScanFace className="h-6 w-6" />
          <span className="sr-only">Face ID</span>
        </Button>
      </div>

      <div className="text-center">
        <p className="text-sm text-foreground/80">
          Don't have an account?{' '}
          <Link
            to={`${REGISTER_ROUTE}${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`}
            className="font-medium text-foreground hover:underline"
          >
            {t('sign-up')}
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};
