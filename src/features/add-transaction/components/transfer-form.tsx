import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';

import { toast } from '@/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { OptionSelector } from '@/components/option-selector';
import { cn } from '@/lib/utils';
import { Account } from '@/types/api';
import { useAccounts } from '@/features/accounts/api/get-accounts';
import { TransactionType } from '@/types';

import { useCreateTransaction } from '../api/create-transaction';
import { useUpdateTransaction } from '../api/update-transaction';
import { DateSelector } from './form-fields/date-selector';
import { FormProps } from './types';
import { SelectorOption } from '@/components/option-selector/types';
import { useNavigate } from 'react-router-dom';
import { ACCOUNT_SETTINGS_ROUTE } from '@/app/router/routes';

const formSchema = z
  .object({
    date: z.date({
      required_error: 'A date is required',
    }),
    amount: z.coerce
      .number({
        required_error: 'Amount is required',
        invalid_type_error: 'Amount must be a number',
      })
      .nonnegative(),
    fromAccountId: z.coerce.number({
      required_error: 'Please select an account',
    }),
    toAccountId: z.coerce.number({
      required_error: 'Please select an account',
    }),
    note: z.optional(
      z.string().max(128, { message: 'Note can be of max 128 characters' }),
    ),
  })
  .refine((data) => data.fromAccountId !== data.toAccountId, {
    message: 'From and To accounts must be different',
    path: ['toAccountId'],
  });

export const TransferForm = ({ existingData, setOpen }: FormProps) => {
  const { t } = useTranslation('transaction');
  const { allAccounts } = useAccounts();
  const navigate = useNavigate();
  const { createTransaction } = useCreateTransaction();
  const { updateTransaction } = useUpdateTransaction();

  const [showAccountSelector, setShowAccountSelector] = useState<
    'fromAccountId' | 'toAccountId' | false
  >(false);

  const accountOptions: SelectorOption[] = useMemo(() => {
    if (!allAccounts) return [];
    return allAccounts.map((acc) => {
      return {
        id: acc.id,
        name: acc.name,
      };
    });
  }, [allAccounts]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      amount: 0,
      toAccountId: -1,
      fromAccountId: -1,
    },
  });
  const formErrors = form.formState.errors;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!values) return false;
    try {
      const transactionData = {
        ...values,
        date: values.date.toISOString(),
        type: TransactionType.TRANSFER,
      };

      if (existingData) {
        await updateTransaction(transactionData, existingData.id);
      } else {
        await createTransaction(transactionData);
      }
      form.reset();
      return setOpen(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        title: 'Operation failed!',
        description: error.message,
      });
    }
  };

  const getSelectedAccountName = useCallback(
    (id: number) => {
      if (!id) return undefined;
      return (
        allAccounts?.find((account) => id === account.id)?.name || undefined
      );
    },
    [allAccounts],
  );

  useEffect(() => {
    if (existingData) {
      form.reset({
        date: new Date(existingData.date),
        amount: existingData.amount,
        fromAccountId: existingData.fromAccountId,
        toAccountId: existingData.toAccountId!,
        note: existingData.note ?? '',
      });
    }
  }, [existingData, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <FormField
          name="date"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center mt-4 space-y-0 space-x-2">
                <FormLabel
                  htmlFor="date"
                  className="w-1/4"
                >
                  {t('transaction:date')}
                </FormLabel>
                <DateSelector
                  aria-invalid={formErrors.date ? 'true' : 'false'}
                  selected={field.value}
                  onSelect={(value: Date) => field.onChange(value)}
                  closeOtherControls={() => setShowAccountSelector(false)}
                />
              </div>
              <FormMessage role="alert" />
            </FormItem>
          )}
        />

        <FormField
          name="amount"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center mt-4 space-y-0 space-x-2">
                <FormLabel
                  htmlFor="amount"
                  className="w-1/4"
                >
                  {t('transaction:amount')}
                </FormLabel>
                <FormControl className="m-0">
                  <Input
                    type="number"
                    className="w-3/4 text-sm"
                    aria-invalid={formErrors.amount ? 'true' : 'false'}
                    onFocus={() => setShowAccountSelector(false)}
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage role="alert" />
            </FormItem>
          )}
        />

        <FormField
          name="fromAccountId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center mt-4 space-y-0 space-x-2">
                <FormLabel
                  htmlFor="fromAccountId"
                  className="w-1/4"
                >
                  {t('transaction:from')}
                </FormLabel>
                <Input
                  className="w-3/4 text-sm"
                  placeholder={t('transaction:select-account')}
                  onClick={() => setShowAccountSelector('fromAccountId')}
                  value={getSelectedAccountName(field.value)}
                  readOnly
                />
              </div>
              <FormMessage role="alert" />
            </FormItem>
          )}
        />

        <FormField
          name="toAccountId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center mt-4 space-y-0 space-x-2">
                <FormLabel
                  htmlFor="toAccountId"
                  className="w-1/4"
                >
                  {t('transaction:to')}
                </FormLabel>
                <FormControl className="m-0">
                  <Input
                    className="w-3/4 text-sm"
                    placeholder={t('transaction:select-account')}
                    onClick={() => setShowAccountSelector('toAccountId')}
                    value={getSelectedAccountName(field.value)}
                    readOnly
                  />
                </FormControl>
              </div>
              <FormMessage role="alert" />
            </FormItem>
          )}
        />

        <FormField
          name="note"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center mt-4 space-y-0 space-x-2">
                <FormLabel
                  htmlFor="note"
                  className="w-1/4"
                >
                  {t('transaction:note')}
                </FormLabel>
                <FormControl className="m-0">
                  <Input
                    className="w-3/4 text-sm"
                    onFocus={() => setShowAccountSelector(false)}
                    placeholder={t('transaction:note-placeholder')}
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage role="alert" />
            </FormItem>
          )}
        />

        <div
          className={cn('overflow-x-auto', {
            'h-44': showAccountSelector,
          })}
        >
          {showAccountSelector && (
            <OptionSelector
              options={accountOptions}
              onSelect={(value: Account) => {
                form.setValue(showAccountSelector, value.id);
                setShowAccountSelector(false);
              }}
              createOptionCallback={() => navigate(ACCOUNT_SETTINGS_ROUTE)}
            />
          )}
        </div>

        <Button
          type="submit"
          className="w-full rounded-full text-md"
          size="lg"
          variant="destructive"
        >
          {existingData ? t('transaction:update') : t('transaction:create')}
        </Button>
      </form>
    </Form>
  );
};
