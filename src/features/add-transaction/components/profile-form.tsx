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
import {
  ACCOUNT_SETTINGS_ROUTE,
  EXPENSE_CATEGORY_SETTINGS_ROUTE,
} from '@/app/router/routes';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useExpenseCategories } from '@/features/expense-category/api/use-expense-categories';
import { useCreateTransaction } from '../api/create-transaction';
import { useUpdateTransaction } from '../api/update-transaction';
import { TransactionType } from '@/types';
import { toast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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

export const ProfileForm = ({ existingData, setOpen }: FormProps) => {
  const [selectorType, setSelectorType] = useState<
    'account' | 'category' | null
  >(null);

  const { selectedDate } = useUiStore();
  const { t } = useTranslation('transaction');
  const navigate = useNavigate();

  const { allAccounts: accounts } = useAccounts();
  const { expenseCategories } = useExpenseCategories();
  const { createTransaction } = useCreateTransaction();
  const { updateTransaction } = useUpdateTransaction();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: selectedDate,
      expenseCategoryId: -1,
      fromAccountId: -1,
      expenseSubcategoryId: existingData?.expenseSubcategoryId ?? null,
    },
  });

  const formErrors = form.formState.errors;
  const expenseCategoryId = form.watch('expenseCategoryId') as
    | number
    | undefined;

  const selectedCategory = React.useMemo(() => {
    return expenseCategories?.find(
      (category) => expenseCategoryId === category.id,
    );
  }, [expenseCategoryId, expenseCategories]);

  const subcategories = selectedCategory?.subcategories || [];
  const isSubcategoriesEmpty =
    Boolean(expenseCategoryId) && subcategories.length === 0;

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

  const getSelectedCategoryName = React.useCallback(
    (id: number) => {
      if (!id) return undefined;
      return (
        expenseCategories?.find((category) => id === category.id)?.name ||
        undefined
      );
    },
    [expenseCategories],
  );

  async function onSubmit(values: z.infer<typeof formSchema>) {
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
                <Popover
                  open={selectorType === 'category'}
                  onOpenChange={(value) =>
                    setSelectorType(value ? 'category' : null)
                  }
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
                          ? getSelectedCategoryName(field.value)
                          : t('transaction:select-a-category')}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 rounded-xl px-1 py-2">
                    <OptionSelector
                      className="h-fit"
                      options={expenseCategories!}
                      onSelect={(option) => {
                        form.setValue('expenseCategoryId', option.id);
                        setSelectorType(null);
                      }}
                      createOptionCallback={() =>
                        navigate(EXPENSE_CATEGORY_SETTINGS_ROUTE)
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
                <Popover
                  open={selectorType === 'account'}
                  onOpenChange={(value) =>
                    setSelectorType(value ? 'account' : null)
                  }
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
                  <PopoverContent className="w-80 rounded-xl px-1 py-2">
                    <OptionSelector
                      className="h-fit"
                      options={accountOptions}
                      onSelect={(option) => {
                        form.setValue('fromAccountId', option.id);
                        setSelectorType(null);
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
                    onFocus={() => setSelectorType(null)}
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
