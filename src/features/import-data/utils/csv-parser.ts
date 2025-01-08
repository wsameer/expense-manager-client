import Papa from 'papaparse';

import { TransactionType } from '@/types';

export interface Transaction {
  Period: Date;
  FromAccount: string;
  Category: string;
  Subcategory: string;
  ToAccount: string;
  Amount: number;
  Type: TransactionType;
  Note: string;
}

export interface ParseResult {
  validTransactions: Transaction[];
  failedRows: { row: number; error: string }[];
}

export function parseAndValidateCSV(file: File): Promise<ParseResult> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        const requiredColumns = [
          'Period',
          'FromAccount',
          'Category',
          'Subcategory',
          'ToAccount',
          'Amount',
          'Type',
          'Note',
        ];
        const headers = results.meta.fields || [];

        if (!requiredColumns.every((col) => headers.includes(col))) {
          const missingColumns = requiredColumns.filter(
            (col) => !headers.includes(col),
          );
          reject(
            new Error(
              `CSV is missing required columns: ${missingColumns.join(', ')}`,
            ),
          );
          return;
        }

        const validTransactions: Transaction[] = [];
        const failedRows: { row: number; error: string }[] = [];

        results.data.forEach((row: any, index: number) => {
          if (!['income', 'expense', 'bank_to_bank'].includes(row.Type)) {
            failedRows.push({
              row: index + 2,
              error: 'Invalid "Type" of transaction',
            });
          }

          if (row.Type === TransactionType.TRANSFER) {
            if (
              typeof row.Period === 'string' &&
              typeof row.FromAccount === 'string' &&
              typeof row.ToAccount === 'string' &&
              typeof row.Note === 'string' &&
              !isNaN(parseFloat(row.Amount))
            ) {
              validTransactions.push({
                ...row,
                Amount: parseFloat(row.Amount),
              });
            } else {
              failedRows.push({
                row: index + 2,
                error:
                  'Some fields are missing for "Transfer" type of transaction',
              });
            }
          } else {
            if (
              typeof row.Period === 'string' &&
              typeof row.FromAccount === 'string' &&
              typeof row.Category === 'string' &&
              typeof row.Note === 'string' &&
              !isNaN(parseFloat(row.Amount))
            ) {
              validTransactions.push({
                ...row,
                Amount: parseFloat(row.Amount),
              });
            } else {
              failedRows.push({
                row: index + 2,
                error: `Some fields are missing for "${row.Type}" type of transaction`,
              });
            }
          }
        });

        resolve({ validTransactions, failedRows });
      },
      error: (error) => {
        reject(new Error(`CSV parsing error: ${error.message}`));
      },
    });
  });
}
