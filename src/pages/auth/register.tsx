import React from 'react'
import { useNavigate } from 'react-router-dom';

import { RegisterForm } from '@/features/auth/register-form';
import { LOGIN_ROUTE } from '@/router/routes';
import { AuthLayout } from '@/components/layout';
import { useTranslation } from 'react-i18next';

export const RegisterRoute = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('auth', { keyPrefix: 'forms' });

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
  )
}
