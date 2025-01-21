import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';
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
import { useAccounts } from '@/features/accounts/api/get-accounts';
import { useIncomeCategories } from '@/features/income-category/api/use-categories';
import { Account } from '@/types/api';
import { useTranslation } from 'react-i18next';
import { DateSelector } from './form-fields/date-selector';
import { useCreateTransaction } from '../api/create-transaction';
import { toast } from '@/hooks';
import { TransactionType } from '@/types';
import { FormProps } from './types';
import { useUpdateTransaction } from '../api/update-transaction';
import { cn, getFormattedDateTime } from '@/lib/utils';
import { OptionSelector } from '@/components/option-selector';

const formSchema = z.object({
  transactionDate: z.date({
    required_error: 'A date is required',
  }),
  amount: z.coerce
    .number({
      required_error: 'Amount is required',
      invalid_type_error: 'Amount must be a number',
    })
    .nonnegative(),
  incomeCategoryId: z.coerce.number({
    required_error: 'Please select a category',
  }),
  toAccountId: z.coerce.number({
    required_error: 'Please select an account',
  }),
  note: z.optional(
    z.string().max(128, { message: 'Note can be of max 128 characters' }),
  ),
});

export const IncomeForm = ({ existingData, setOpen }: FormProps) => {
  const [showAccountSelector, setShowAccountSelector] = useState(false);
  const [showCategorySelector, setShowCategorySelector] = useState(false);

  const { t } = useTranslation('transaction');
  const { allAccounts } = useAccounts();
  const { incomeCategories } = useIncomeCategories();
  const { createTransaction } = useCreateTransaction();
  const { updateTransaction } = useUpdateTransaction();

  const incomeCategoryOptions = useCallback(() => {
    if (!incomeCategories) return [];

    return incomeCategories.map((d) => {
      return {
        id: d.id,
        name: d.name,
      };
    });
  }, [incomeCategories]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transactionDate: new Date(),
      amount: 0,
    },
  });
  const formErrors = form.formState.errors;

  const getSelectedAccountName = useCallback(
    (id: number) => {
      if (!id) return undefined;
      return (
        allAccounts?.find((account) => id === account.id)?.name || undefined
      );
    },
    [allAccounts],
  );

  const getSelectedCategoryName = useCallback(
    (id: number) => {
      if (!id) return undefined;
      return (
        incomeCategories?.find((category) => id === category.id)?.name ||
        undefined
      );
    },
    [incomeCategories],
  );

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!values) return false;
    try {
      const transactionData = {
        ...values,
        // Format: YYYY-MM-DD HH:MM:SS
        date: getFormattedDateTime(values.transactionDate),
        type: TransactionType.INCOME,
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

  useEffect(() => {
    if (existingData) {
      form.reset({
        transactionDate: new Date(existingData.date),
        amount: existingData.amount,
        incomeCategoryId: existingData.incomeCategoryId!,
        toAccountId: existingData.toAccountId ?? undefined,
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
          name="transactionDate"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center mt-4 space-y-0 space-x-2">
                <FormLabel
                  htmlFor="transactionDate"
                  className="w-1/4"
                >
                  {t('transaction:date')}
                </FormLabel>
                <DateSelector
                  aria-invalid={formErrors.transactionDate ? 'true' : 'false'}
                  selected={field.value}
                  onSelect={(value: Date) => field.onChange(value)}
                  closeOtherControls={() => {
                    setShowAccountSelector(false);
                    setShowCategorySelector(false);
                  }}
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
                    className="w-3/4"
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
          name="incomeCategoryId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center mt-4 space-y-0 space-x-2">
                <FormLabel
                  htmlFor="incomeCategoryId"
                  className="w-1/4"
                >
                  {t('transaction:category')}
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-3/4"
                    placeholder={t('transaction:select-a-category')}
                    onClick={() => {
                      setShowAccountSelector(false);
                      setShowCategorySelector(true);
                    }}
                    value={getSelectedCategoryName(field.value)}
                    readOnly
                  />
                </FormControl>
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
                  {t('transaction:account')}
                </FormLabel>
                <FormControl className="m-0">
                  <Input
                    className="w-3/4"
                    placeholder={t('transaction:select-account')}
                    onClick={() => setShowAccountSelector(true)}
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
                    className="w-3/4"
                    onFocus={() => setShowAccountSelector(false)}
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
            'h-44': showAccountSelector || showCategorySelector,
          })}
        >
          {showAccountSelector && (
            <OptionSelector
              options={allAccounts!}
              onSelect={(value: Account) => {
                form.setValue('toAccountId', value.id);
                setShowAccountSelector(false);
              }}
            />
          )}

          {showCategorySelector && (
            <OptionSelector
              options={incomeCategoryOptions()}
              onSelect={(option) => {
                form.setValue('incomeCategoryId', option.id);
                setShowCategorySelector(false);
              }}
            />
          )}
        </div>

        <Button
          className="w-full"
          variant="destructive"
          type="submit"
        >
          {existingData ? t('transaction:update') : t('transaction:create')}
        </Button>
      </form>
    </Form>
  );
};
