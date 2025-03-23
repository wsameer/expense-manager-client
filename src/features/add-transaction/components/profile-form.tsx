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
import { useOnClickOutside } from '@/hooks/use-on-click-outside';
import { SelectorOption } from '@/components/option-selector/types';
import { OptionSelector } from '@/components/option-selector';
import { useNavigate } from 'react-router-dom';
import { ACCOUNT_SETTINGS_ROUTE } from '@/app/router/routes';

const formSchema = z.object({
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
  note: z.optional(
    z.string().max(128, { message: 'Note can be of max 128 characters' }),
  ),
});

export const ProfileForm = ({ existingData, setOpen }: FormProps) => {
  const [selectorType, setSelectorType] = useState<
    'account' | 'category' | null
  >(null);

  const { selectedDate } = useUiStore();
  const { allAccounts: accounts } = useAccounts();
  const { t } = useTranslation('transaction');
  const navigate = useNavigate();

  const accountSelectorRef = React.useRef<HTMLDivElement>(null);
  useOnClickOutside(accountSelectorRef, () => setSelectorType(null));

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: selectedDate,
      fromAccountId: -1,
    },
  });

  const formErrors = form.formState.errors;

  const accountOptions: SelectorOption[] = React.useMemo(() => {
    if (!accounts) return [];
    return accounts.map((acc) => {
      return {
        id: acc.id,
        name: acc.name,
      };
    });
  }, [accounts]);

  const getSelectedAccountName = React.useCallback(
    (id: number) => {
      if (!id) return undefined;
      return accounts?.find((account) => id === account.id)?.name || undefined;
    },
    [accounts],
  );

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values) return false;

    console.log(values);
    return setOpen(false);
  }

  React.useEffect(() => {
    if (existingData) {
      form.reset({
        date: new Date(existingData.date),
        amount: existingData.amount,
        fromAccountId: existingData.fromAccountId,
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
                  closeOtherControls={() => setSelectorType(null)}
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
                    onFocus={() => setSelectorType(null)}
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
                <FormControl className="m-0">
                  <Input
                    className="w-3/4 text-base"
                    placeholder={t('transaction:select-account')}
                    onFocus={() => setSelectorType('account')}
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
                    {...field}
                    className="w-3/4 text-base"
                    placeholder={t('transaction:note-placeholder')}
                    onFocus={() => setSelectorType(null)}
                  />
                </FormControl>
              </div>
              <FormMessage role="alert" />
            </FormItem>
          )}
        />

        {selectorType === 'account' && (
          <OptionSelector
            ref={accountSelectorRef}
            className={`${selectorType ? 'h-44' : 'h-44'}`}
            options={accountOptions}
            onSelect={(option) => {
              form.setValue('fromAccountId', option.id);
              setSelectorType(null);
            }}
            createOptionCallback={() => navigate(ACCOUNT_SETTINGS_ROUTE)}
          />
        )}

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
