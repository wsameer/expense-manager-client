import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { z } from 'zod';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FORGOT_PASSWORD, REGISTER_ROUTE } from '@/router/routes';
import { Button } from '@/components/ui/button';
import { Link } from '@/components/ui/link';
import { useAuth } from '@/hooks';

type LoginFormProps = {
  onSuccess: () => void;
};

const loginFormSchema = z.object({
  email: z.string().min(8, 'Email is required').email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type UserLoginParameters = z.infer<typeof loginFormSchema>;

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const { t } = useTranslation('auth', { keyPrefix: 'forms' });
  const { login } = useAuth();

  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');

  const form = useForm<UserLoginParameters>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof loginFormSchema>) => {
    const response = await login(values.email, values.password);
    if (response) onSuccess();
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">{t('login')}</CardTitle>
        <CardDescription>{t('your-email-address')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            id="login-form"
            className="grid gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel htmlFor="email">{t('email')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('email-placeholder')}
                      autoComplete="username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <div className="flex items-center">
                    <FormLabel htmlFor="password">{t('password')}</FormLabel>
                    <Button
                      variant="link"
                      className="ml-auto inline-block text-sm underline"
                      asChild
                    >
                      <Link to={FORGOT_PASSWORD}>
                        {t('forgot-your-password')}
                      </Link>
                    </Button>
                  </div>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="*******"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
            >
              {t('login')}
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          {t('dont-have-an-account')}{' '}
          <Link
            to={`${REGISTER_ROUTE}${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`}
            className="underline dark:text-white"
          >
            {t('sign-up')}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
