import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';

import { toast } from '@/hooks';
import { cleanString, getFormattedDateTime } from '@/lib/utils';
import { TransactionType } from '@/types';
import { parseAndValidateCSV, Transaction } from './utils/csv-parser';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useAccounts } from '../accounts/api/get-accounts';
import { useCreateTransaction } from '../add-transaction/api/create-transaction';
import { useExpenseCategories } from '../expense-category/api/use-expense-categories';
import { useIncomeCategories } from '../income-categories/api/use-categories';
import { Subcategory } from '../expense-category/types';

const csvFileSchema = z.object({
  file: z
    .instanceof(File, {
      message: 'Please select a file',
    })
    .refine(
      (file) => file.type === 'text/csv' || file.name.endsWith('.csv'),
      'File must be a CSV',
    )
    .refine(
      (file) => file.size <= 5 * 1024 * 1024, // 5MB limit
      'File size must be less than 5MB',
    ),
});

type CSVFormData = z.infer<typeof csvFileSchema>;

export const ImportCsvForm = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [parseProgress, setParseProgress] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [results, setResults] = useState<{ success: number; failed: number }>({
    success: 0,
    failed: 0,
  });
  const [, setFailedRows] = useState<{ row: number; error: string }[]>([]);

  const { t } = useTranslation('settings');
  const { allAccounts } = useAccounts();
  const { createTransaction } = useCreateTransaction();
  const { expenseCategories } = useExpenseCategories();
  const { incomeCategories } = useIncomeCategories();

  const form = useForm<CSVFormData>({
    resolver: zodResolver(csvFileSchema),
  });

  useEffect(() => {
    return () => {
      form.reset();
      setIsUploading(false);
      setParseProgress(0);
      setUploadProgress(0);
      setFailedRows([]);
    };
  }, [form]);

  const handleError = (error: unknown) => {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    toast({
      title: 'Upload failed',
      description: errorMessage,
      variant: 'destructive',
    });
    setIsUploading(false);
    setParseProgress(0);
    setUploadProgress(0);
  };

  const getSubCategoryId = useCallback(
    (transaction: Transaction) => {
      const category = expenseCategories?.find(
        (expense) =>
          cleanString(expense.name) === cleanString(transaction.Category),
      );
      const subcategory = category?.subcategories?.find(
        (subC: Subcategory) =>
          cleanString(subC.name) === cleanString(transaction.Subcategory),
      );
      return subcategory?.id;
    },
    [expenseCategories],
  );

  const postTransaction = async (transaction: Transaction) => {
    let transactionPayload = null;

    switch (transaction.Type) {
      case 'bank_to_bank':
        transactionPayload = {
          date: getFormattedDateTime(transaction.Period),
          type: TransactionType.TRANSFER,
          amount: transaction.Amount,
          fromAccountId:
            allAccounts?.find(
              (account) =>
                cleanString(account.name) ===
                cleanString(transaction.FromAccount),
            )?.id ?? 0,
          toAccountId:
            allAccounts?.find(
              (account) =>
                cleanString(account.name) ===
                cleanString(transaction.ToAccount),
            )?.id ?? 0,
          note: transaction.Note,
        };
        break;

      case 'expense':
        transactionPayload = {
          date: getFormattedDateTime(transaction.Period),
          type: TransactionType.EXPENSE,
          amount: transaction.Amount,
          fromAccountId:
            allAccounts?.find(
              (account) =>
                cleanString(account.name) ===
                cleanString(transaction.FromAccount),
            )?.id ?? 0,
          expenseCategoryId:
            expenseCategories?.find(
              (expense) =>
                cleanString(expense.name) === cleanString(transaction.Category),
            )?.id ?? 0,
          expenseSubcategoryId: getSubCategoryId(transaction),
          note: transaction.Note,
        };
        break;

      case 'income':
        transactionPayload = {
          date: getFormattedDateTime(transaction.Period),
          type: TransactionType.INCOME,
          amount: transaction.Amount,
          incomeCategoryId:
            incomeCategories?.find(
              (income) =>
                cleanString(income.name) === cleanString(transaction.Category),
            )?.id ?? 0,
          fromAccountId:
            allAccounts?.find(
              (account) =>
                cleanString(account.name) ===
                cleanString(transaction.FromAccount),
            )?.id ?? 0,
          note: transaction.Note,
        };
        break;
    }

    if (!transactionPayload) return;

    await createTransaction(transactionPayload);
    return true;
  };

  const onSubmit = async (data: CSVFormData) => {
    if (!data.file) return;

    setIsUploading(true);
    setParseProgress(0);
    setUploadProgress(0);
    setResults({ success: 0, failed: 0 });
    setFailedRows([]);

    try {
      const fileReader = new FileReader();
      fileReader.onprogress = (event) => {
        if (event.lengthComputable) {
          setParseProgress((event.loaded / event.total) * 100);
        }
      };

      fileReader.onload = async () => {
        try {
          const { validTransactions, failedRows } = await parseAndValidateCSV(
            data.file,
          );

          setFailedRows(failedRows);
          setResults((prev) => ({ ...prev, failed: failedRows.length }));

          const totalTransactions = validTransactions.length;

          for (let i = 0; i < totalTransactions; i++) {
            try {
              await postTransaction(validTransactions[i]);
              setResults((prev) => ({ ...prev, success: prev.success + 1 }));
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error: unknown) {
              setResults((prev) => ({ ...prev, failed: prev.failed + 1 }));
              setFailedRows((prev) => [
                ...prev,
                { row: i + 2, error: 'API error' },
              ]);
            }
            setUploadProgress(((i + 1) / totalTransactions) * 100);
          }
        } catch (error) {
          handleError(error);
        }
      };
      fileReader.readAsText(data.file);
    } catch (error) {
      handleError(error);
    } finally {
      form.reset();
      setIsUploading(false);
    }
  };

  return (
    <>
      <div className="grid gap-2 px-4 py-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="file"
              render={() => (
                <FormItem>
                  <FormLabel htmlFor="csv-upload">
                    {t('data.csv-file')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="csv-upload"
                      accept=".csv"
                      type="file"
                      disabled={isUploading}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          form.setValue('file', file);
                          setFailedRows([]);
                          setResults({ success: 0, failed: 0 });
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage role="alert" />
                </FormItem>
              )}
            />
            <Button
              className="w-full mt-4"
              type="submit"
              variant="default"
              disabled={isUploading}
            >
              {isUploading && <Loader2 className="animate-spin" />}
              {isUploading ? t('uploading') : t('submit')}
            </Button>
          </form>
        </Form>
      </div>

      {isUploading && (
        <div className="px-4 py-2 space-y-4">
          <div>
            <p className="text-sm font-medium mb-1">File Parsing Progress</p>
            <Progress
              value={parseProgress}
              className="w-full"
            />
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Upload Progress</p>
            <Progress
              value={uploadProgress}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Processed: {results.success + results.failed}</span>
            <span>Success: {results.success}</span>
            <span>Failed: {results.failed}</span>
          </div>
        </div>
      )}

      {!isUploading && (results.success > 0 || results.failed > 0) && (
        <div className="grid gap-2 px-4 py-2 rounded-lg">
          <h2 className="text-m font-semibold mb-2">Upload Results</h2>
          <div className="flex items-center space-x-2">
            <CheckCircle className="text-green-500" />
            <small className="text-sm font-medium leading-none">
              Successfully uploaded: {results.success}
            </small>
          </div>
          <div className="flex items-center space-x-2">
            <XCircle className="text-red-500" />
            <small className="text-sm font-medium leading-none">
              Failed to upload: {results.failed}
            </small>
          </div>
        </div>
      )}
    </>
  );
};
