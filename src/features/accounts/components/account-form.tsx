import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { AccountGroup } from '@/types/api';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Link } from 'react-router-dom';
import { SETTINGS_ROUTE } from '@/router/routes';
import { ACCOUNT_GROUPS, CREDIT_CARD } from '../constants';
import {
  AccountGroupEnum,
  CreateAccountForm,
  createAccountFormSchema,
} from '../types';
import { toast } from '@/hooks';
import { useAccounts } from '../api/get-accounts';
import { useUpdateAccount } from '../api/update-account';
import { capitalize, cn } from '@/lib/utils';
import { useCreateAccount } from '../api/create-account';

type Props = React.ComponentProps<'form'> & {
  name?: string;
  group: AccountGroupEnum;
  balance?: number;
  description?: string | undefined;
  paymentAccountId?: number | undefined;
  setOpen: (value: boolean) => void;
  editMode?: number; // this is actually the id of the account
};

export const AccountForm = ({
  className,
  name,
  group,
  paymentAccountId,
  setOpen,
  description,
  balance = 0.0,
  editMode = undefined,
}: Props) => {
  const { allAccounts } = useAccounts();
  const { createAccount, isCreating } = useCreateAccount();
  const { updateAccount, isUpdating } = useUpdateAccount();
  const [showPaymentOptions, setShowPaymentOptions] = useState(
    group === CREDIT_CARD,
  );

  const { t } = useTranslation('account', {
    keyPrefix: 'create-account-form',
  });

  const form = useForm<CreateAccountForm>({
    resolver: zodResolver(createAccountFormSchema),
    defaultValues: {
      name: name ?? '',
      balance,
      group,
      description: description ?? '',
      paymentAccountId,
    },
  });

  const handleCreateAccount = async (values: CreateAccountForm) => {
    if (!values) return false;

    try {
      await createAccount(values);
      form.reset();
      toast({
        title: 'New Account Created',
        description: `Your account named "${values.name}" has been created`,
      });
      return setOpen(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        title: 'Operation failed!',
        description: error.message,
      });
    }
  };

  const handleEditAccount = async (values: CreateAccountForm) => {
    if (!values || !editMode) return false;
    const result = await updateAccount(values, editMode);
    if (result) {
      form.reset();
      toast({
        title: 'Account Updated',
        description: `Your account named "${values.name}" has been updated`,
      });
      return setOpen(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          editMode ? handleEditAccount : handleCreateAccount,
        )}
        className={cn('space-y-4', className)}
      >
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center mt-4 space-y-0 space-x-2">
                <FormLabel
                  htmlFor="name"
                  className="w-1/3"
                >
                  {t('name')}
                </FormLabel>
                <Input
                  placeholder="Account Name"
                  {...field}
                />
              </div>
              <FormMessage role="alert" />
            </FormItem>
          )}
        />

        <FormField
          name="group"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center mt-4 space-y-0 space-x-2">
                <FormLabel
                  htmlFor="group"
                  className="w-1/3"
                >
                  {t('group')}
                </FormLabel>
                <Select
                  onValueChange={(value) => {
                    if (value === CREDIT_CARD) {
                      setShowPaymentOptions(true);
                    } else {
                      form.setValue('paymentAccountId', undefined);
                      setShowPaymentOptions(false);
                    }
                    field.onChange(value);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a group type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ACCOUNT_GROUPS.map(({ id, label, key }) => (
                      <SelectItem
                        key={id}
                        value={key}
                      >
                        {capitalize(label)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <FormDescription>
                You can manage account groups in your{' '}
                <Link
                  className="underline"
                  to={SETTINGS_ROUTE}
                >
                  account settings
                </Link>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {showPaymentOptions ? (
          <FormField
            name="paymentAccountId"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center mt-4 space-y-0 space-x-2">
                  <FormLabel
                    htmlFor="paymentAccountId"
                    className="w-1/3"
                  >
                    {t('payment')}
                  </FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a payment account">
                          {
                            allAccounts?.find(
                              (option) => option.id === field.value,
                            )?.name
                          }
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {allAccounts?.map(({ id, group, name }) =>
                        group === AccountGroup.CHEQUING ||
                        group === AccountGroup.SAVINGS ? (
                          <SelectItem
                            key={id}
                            value={id}
                          >
                            {capitalize(name)}
                          </SelectItem>
                        ) : null,
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}

        <FormField
          name="balance"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center mt-4 space-y-0 space-x-2">
                <FormLabel
                  htmlFor="balance"
                  className="w-1/3"
                >
                  {t('balance')}
                </FormLabel>
                <Input {...field} />
              </div>
              <FormMessage role="alert" />
            </FormItem>
          )}
        />

        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center mt-4 space-y-0 space-x-2">
                <FormLabel
                  htmlFor="description"
                  className="w-1/3"
                >
                  {t('description')}
                </FormLabel>
                <Input {...field} />
              </div>
              <FormMessage role="alert" />
            </FormItem>
          )}
        />

        <div className=""></div>

        <Button
          className="w-full"
          variant="destructive"
          type="submit"
          disabled={isCreating || isUpdating}
        >
          {editMode ? t('save-changes') : t('create-account')}
        </Button>
      </form>
    </Form>
  );
};
