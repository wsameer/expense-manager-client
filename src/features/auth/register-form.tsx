import React from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LOGIN_ROUTE } from '@/router/routes';
import { Link } from '@/components/ui/link';
import { toast } from '@/hooks';
import { useAuth } from '@/hooks';

type RegisterFormProps = {
  onSuccess: () => void;
};

const registerFormSchema = z
  .object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    email: z
      .string()
      .min(8, 'Email is required')
      .email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    password_confirmation: z
      .string()
      .min(6, 'Password must be at least 8 characters'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    path: ['password_confirmation'],
    message: 'Passwords do not match',
  });

export type UserRegistrationParams = z.infer<typeof registerFormSchema>;

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const { t } = useTranslation('auth', { keyPrefix: 'forms' });
  const { register } = useAuth();

  const form = useForm<UserRegistrationParams>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    },
  })

  const onSubmit = async (values: UserRegistrationParams) => {
    const success = await register(values.name, values.email, values.password);

    if (success) {
      toast({
        title: t('registration-toast.title'),
        description: t('registration-toast.message'),
      });
      return onSuccess();
    } else {
      form.reset();
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">{t('sign-up')}</CardTitle>
        <CardDescription>{t('enter-your-information')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            id="sign-up-form"
            className="grid gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel htmlFor="name">{t('name')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel htmlFor="email">{t('email')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="jon@doe.com"
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
                  <FormLabel htmlFor="password">{t('password')}</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="*******"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password_confirmation"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel htmlFor="password_confirmation">
                    {t('confirm-password')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="*******"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="mt-4 w-full"
              variant="default"
              type="submit"
            >
              {t('create-an-account')}
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          {t('have-an-account')}{' '}
          <Link
            to={LOGIN_ROUTE}
            className="underline dark:text-white"
          >
            {t('sign-in')}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
