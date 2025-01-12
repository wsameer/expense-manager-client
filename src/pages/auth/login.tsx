import { useNavigate, useSearchParams } from 'react-router-dom';

import { APP_ROUTE } from '@/router/routes';
import { useTranslation } from 'react-i18next';
import { AuthLayout } from '@/components/layout';
import { LoginForm } from '@/features/auth/login-form';

export const LoginRoute = () => {
  const { t } = useTranslation('auth', { keyPrefix: 'forms' });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  console.log('🚀 ~ LoginRoute ~ searchParams:', searchParams);
  const redirectTo = searchParams.get('redirectTo');

  return (
    <AuthLayout title={t('login')}>
      <LoginForm
        onSuccess={() =>
          navigate(`${redirectTo ? `${redirectTo}` : APP_ROUTE}`, {
            replace: true,
          })
        }
      />
    </AuthLayout>
  );
};
