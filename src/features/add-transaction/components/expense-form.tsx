/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAccountStore } from '@/store/accountsStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { OptionSelector } from '@/components/option-selector';
import { TransactionType } from '@/types';
import { useExpenseCategories } from '@/features/expense-category/api/use-expense-categories';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks';
import {
  ACCOUNT_SETTINGS_ROUTE,
  EXPENSE_CATEGORY_SETTINGS_ROUTE,
} from '@/app/router/routes';
import { useOnClickOutside } from '@/hooks/use-on-click-outside';
import { SelectorOption } from '@/components/option-selector/types';

import { useCreateTransaction } from '../api/create-transaction';
import { useUpdateTransaction } from '../api/update-transaction';
import { DateSelector } from './form-fields/date-selector';
import { FormProps } from './types';
import { useUiStore } from '@/store/uiStore';

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
  expenseCategoryId: z.coerce.number({
    required_error: 'Please select a category',
  }),
  expenseSubcategoryId: z.coerce.number().nullable(),
  fromAccountId: z.coerce.number({
    required_error: 'Please select an account',
  }),
  note: z.optional(
    z.string().max(128, { message: 'Note can be of max 128 characters' }),
  ),
});

export const ExpenseForm = ({ existingData, setOpen }: FormProps) => {
  const [selectorType, setSelectorType] = useState<
    'account' | 'category' | null
  >(null);

  const { t } = useTranslation('transaction');
  const navigate = useNavigate();

  const { selectedDate } = useUiStore();
  const { accounts } = useAccountStore();
  const { expenseCategories } = useExpenseCategories();
  const { createTransaction } = useCreateTransaction();
  const { updateTransaction } = useUpdateTransaction();

  const accountSelectorRef = useRef<HTMLDivElement>(null);
  const expenseCategorySelectorRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(accountSelectorRef, () => setSelectorType(null));
  useOnClickOutside(expenseCategorySelectorRef, () => setSelectorType(null));

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: selectedDate,
      amount: 0,
      expenseCategoryId: -1,
      fromAccountId: -1,
      expenseSubcategoryId: existingData?.expenseSubcategoryId ?? null,
    },
  });
  const formErrors = form.formState.errors;
  const expenseCategoryId = form.watch('expenseCategoryId') as
    | number
    | undefined;

  const selectedCategory = useMemo(() => {
    return expenseCategories?.find(
      (category) => expenseCategoryId === category.id,
    );
  }, [expenseCategoryId, expenseCategories]);

  const subcategories = selectedCategory?.subcategories || [];
  const isSubcategoriesEmpty =
    Boolean(expenseCategoryId) && subcategories.length === 0;

  const accountOptions: SelectorOption[] = useMemo(() => {
    if (!accounts) return [];
    return accounts.map((acc) => {
      return {
        id: acc.id,
        name: acc.name,
      };
    });
  }, [accounts]);

  const getSelectedAccountName = useCallback(
    (id: number) => {
      if (!id) return undefined;
      return accounts?.find((account) => id === account.id)?.name || undefined;
    },
    [accounts],
  );

  const getSelectedCategoryName = useCallback(
    (id: number) => {
      if (!id) return undefined;
      return (
        expenseCategories?.find((category) => id === category.id)?.name ||
        undefined
      );
    },
    [expenseCategories],
  );

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!values) return false;

    try {
      const transactionData = {
        ...values,
        date: values.date.toISOString(), // has to be ISO as DB doesn't understand else
        type: TransactionType.EXPENSE,
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
      return false;
    }
  };

  useEffect(() => {
    if (existingData) {
      form.reset({
        date: new Date(existingData.date),
        amount: existingData.amount,
        expenseCategoryId: existingData.expenseCategoryId!,
        expenseSubcategoryId: existingData.expenseSubcategoryId ?? null,
        fromAccountId: existingData.fromAccountId,
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
                    className="w-3/4 text-sm"
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
          name="expenseCategoryId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center mt-4 space-y-0 space-x-2">
                <FormLabel
                  htmlFor="expenseCategoryId"
                  className="w-1/4"
                >
                  {t('transaction:category')}
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-3/4 text-sm"
                    placeholder={t('transaction:select-a-category')}
                    value={getSelectedCategoryName(field.value)}
                    onFocus={() => setSelectorType('category')}
                    readOnly
                  />
                </FormControl>
              </div>
              <FormMessage role="alert" />
            </FormItem>
          )}
        />

        <FormField
          name="expenseSubcategoryId"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem>
                <div className="flex items-center mt-4 space-y-0 space-x-4">
                  <FormLabel
                    htmlFor="expenseSubcategoryId"
                    className="w-1/4"
                  >
                    {t('transaction:sub-category')}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value?.toString() || undefined}
                    disabled={isSubcategoriesEmpty}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            !expenseCategoryId
                              ? 'Select category first'
                              : isSubcategoriesEmpty
                                ? 'No subcategories'
                                : 'Select a subcategory'
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isSubcategoriesEmpty ? (
                        <SelectItem
                          value={'empty'}
                          disabled
                        >
                          {t('transaction:no-subcategories')}
                        </SelectItem>
                      ) : (
                        subcategories.map((subcategory) => (
                          <SelectItem
                            key={subcategory.id}
                            value={subcategory.id.toString()}
                          >
                            {subcategory.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <FormMessage role="alert" />
              </FormItem>
            );
          }}
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
                    className="w-3/4 text-sm"
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
                    className="w-3/4 text-sm"
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
            className={`${selectorType ? 'h-44' : ''}`}
            options={accountOptions}
            onSelect={(option: any) => {
              form.setValue('fromAccountId', option.id);
              setSelectorType(null);
            }}
            createOptionCallback={() => navigate(ACCOUNT_SETTINGS_ROUTE)}
          />
        )}

        {selectorType === 'category' && (
          <OptionSelector
            ref={expenseCategorySelectorRef}
            className={`${selectorType ? 'h-44' : ''}`}
            options={expenseCategories!}
            onSelect={(option: any) => {
              form.setValue('expenseCategoryId', option.id);
              setSelectorType(null);
            }}
            createOptionCallback={() =>
              navigate(EXPENSE_CATEGORY_SETTINGS_ROUTE)
            }
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
