import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from '@/components/ui/link';
import { useAuth } from '@/hooks';
import { Checkbox } from '@/components/ui/checkbox';
import { FORGOT_PASSWORD } from '@/router/routes';

type LoginFormProps = {
  onSuccess: () => void;
};

const loginFormSchema = z.object({
  email: z.string().min(8, 'Email is required').email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().default(false).optional(),
});

export type UserLoginParameters = z.infer<typeof loginFormSchema>;

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const { t } = useTranslation('auth', { keyPrefix: 'forms' });
  const { login } = useAuth();

  const form = useForm<UserLoginParameters>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof loginFormSchema>) => {
    const response = await login(values.email, values.password);
    if (response) onSuccess();
  };

  return (
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
            <FormItem>
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
            <FormItem>
              <FormLabel htmlFor="password">{t('password')}</FormLabel>
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

        <div className="flex items-center justify-between">
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal">
                  {t('remember-me')}
                </FormLabel>
              </FormItem>
            )}
          />
          <Button
            variant="link"
            asChild
          >
            <Link
              to={FORGOT_PASSWORD}
              className="text-sm text-foreground dark:text-foreground"
            >
              {t('forgot-your-password')}
            </Link>
          </Button>
        </div>
        <Button
          type="submit"
          className="w-full rounded-full h-12 text-base mt-4"
        >
          {t('login')}
        </Button>
      </form>
    </Form>
  );
};
