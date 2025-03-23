/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormProps } from './types';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useUiStore } from '@/store/uiStore';
import { DateSelector } from './form-fields/date-selector';
import { useTranslation } from 'react-i18next';
import { useAccounts } from '@/features/accounts/api/get-accounts';
import { SelectorOption } from '@/components/option-selector/types';
import { useNavigate } from 'react-router-dom';
import { OptionSelector } from '@/components/option-selector';
import { ACCOUNT_SETTINGS_ROUTE } from '@/app/router/routes';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCreateTransaction } from '../api/create-transaction';
import { useUpdateTransaction } from '../api/update-transaction';
import { TransactionType } from '@/types';
import { toast } from '@/hooks/use-toast';

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

export const ProfileForm = ({ existingData, setOpen }: FormProps) => {
  const [showAccountSelector, setShowAccountSelector] = useState<
    'fromAccountId' | 'toAccountId' | false
  >(false);

  const { selectedDate } = useUiStore();
  const { t } = useTranslation('transaction');
  const navigate = useNavigate();
  const { allAccounts } = useAccounts();
  const { createTransaction } = useCreateTransaction();
  const { updateTransaction } = useUpdateTransaction();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: selectedDate,
      toAccountId: -1,
      fromAccountId: -1,
    },
  });
  const formErrors = form.formState.errors;

  const accountOptions: SelectorOption[] = React.useMemo(() => {
    if (!allAccounts) return [];
    return allAccounts.map((acc) => {
      return {
        id: acc.id,
        name: acc.name,
      };
    });
  }, [allAccounts]);

  const getSelectedAccountName = React.useCallback(
    (id: number) => {
      if (!id) return undefined;
      return (
        allAccounts?.find((account) => id === account.id)?.name || undefined
      );
    },
    [allAccounts],
  );

  async function onSubmit(values: z.infer<typeof formSchema>) {
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
    } catch (error: any) {
      toast({
        title: 'Operation failed!',
        description: error.message,
      });
    }
  }

  React.useEffect(() => {
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
                    placeholder="0.00"
                    className="w-3/4 text-base"
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
                  {t('transaction:account')}
                </FormLabel>
                <Popover
                  open={showAccountSelector === 'fromAccountId'}
                  onOpenChange={(value) => {
                    setShowAccountSelector(value ? 'fromAccountId' : false);
                  }}
                >
                  <PopoverTrigger asChild>
                    <FormControl className="m-0">
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          'w-3/4 text-base justify-between',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value > 0
                          ? getSelectedAccountName(field.value)
                          : t('transaction:select-account')}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 rounded-xl p-2">
                    <OptionSelector
                      className="h-fit"
                      options={accountOptions}
                      onSelect={(value) => {
                        form.setValue('fromAccountId', value.id);
                        setShowAccountSelector(false);
                      }}
                      createOptionCallback={() =>
                        navigate(ACCOUNT_SETTINGS_ROUTE)
                      }
                    />
                  </PopoverContent>
                </Popover>
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
                <Popover
                  open={showAccountSelector === 'toAccountId'}
                  onOpenChange={(value) => {
                    setShowAccountSelector(value ? 'toAccountId' : false);
                  }}
                >
                  <PopoverTrigger asChild>
                    <FormControl className="m-0">
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          'w-3/4 text-base justify-between',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value > 0
                          ? getSelectedAccountName(field.value)
                          : t('transaction:select-account')}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 rounded-xl p-2">
                    <OptionSelector
                      className="h-fit"
                      options={accountOptions}
                      onSelect={(value) => {
                        form.setValue('toAccountId', value.id);
                        setShowAccountSelector(false);
                      }}
                      createOptionCallback={() =>
                        navigate(ACCOUNT_SETTINGS_ROUTE)
                      }
                    />
                  </PopoverContent>
                </Popover>
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
                    {...field}
                    className="w-3/4 text-base"
                    placeholder={t('transaction:note-placeholder')}
                    onFocus={() => setShowAccountSelector(false)}
                  />
                </FormControl>
              </div>
              <FormMessage role="alert" />
            </FormItem>
          )}
        />

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
