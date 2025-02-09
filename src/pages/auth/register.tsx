import { Link, useNavigate } from 'react-router-dom';

import { RegisterForm } from '@/features/auth/register-form';
import { LOGIN_ROUTE } from '@/router/routes';
import { AuthLayout } from '@/components/layout/auth-layout';
import { useTranslation } from 'react-i18next';

export const RegisterRoute = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('auth', { keyPrefix: 'forms' });

  return (
    <AuthLayout title={t('sign-up')}>
      <div>
        <h1 className="text-4xl font-light text-zinc-900">
          {t('stay-on-budget')}
        </h1>
        <p className="text-xl font-light text-zinc-400 mt-2">
          {t('enter-your-information')}
        </p>
      </div>

      <RegisterForm
        onSuccess={() =>
          navigate(LOGIN_ROUTE, {
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

      <div className="text-center">
        <p className="text-sm text-zinc-500">
          {t('have-an-account')}{' '}
          <Link
            to={LOGIN_ROUTE}
            className="underline dark:text-white"
          >
            {t('sign-in')}
          </Link>
        </p>
      </div>
    </AuthLayout>
  );

  return (
    <AuthLayout title={t('sign-up')}>
      <RegisterForm
        onSuccess={() =>
          navigate(LOGIN_ROUTE, {
            replace: true,
          })
        }
      />
    </AuthLayout>
  );
};
