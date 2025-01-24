import React, { useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { Transaction } from '../types';
import { TransactionType } from '@/types';
import { cn } from '@/lib/utils';

type TransactionItemProps = {
  transaction: Transaction;
  onTransactionClick: (transaction: Transaction) => void;
};

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onTransactionClick,
}) => {
  const getCategory = useCallback(() => {
    if (
      transaction.type === TransactionType.EXPENSE &&
      transaction.expenseCategory
    ) {
      return transaction.expenseCategory.name;
    }

    if (
      transaction.type === TransactionType.INCOME &&
      transaction.incomeCategory
    ) {
      return transaction.incomeCategory.name;
    }

    if (transaction.type === TransactionType.TRANSFER) {
      return 'Transfer';
    }
  }, [transaction]);

  const getSubcategory = useCallback(() => {
    if (
      transaction.type === TransactionType.EXPENSE &&
      transaction.expenseSubcategory
    ) {
      return transaction.expenseSubcategory.name;
    }
  }, [transaction]);

  const getBankName = useCallback(
    (transactionType: TransactionType) => {
      switch (transactionType) {
        case TransactionType.EXPENSE:
          return transaction.fromAccount?.name;

        case TransactionType.INCOME:
          return transaction.toAccount?.name;

        case TransactionType.TRANSFER:
          return `${transaction.fromAccount?.name} → ${transaction.toAccount?.name}`;

        default:
          break;
      }
    },
    [transaction],
  );

  return (
    <Button
      className="flex h-12 items-center justify-between py-1 px-2 bg-white dark:bg-zinc-800 dark:hover:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-900 cursor-pointer first:border-t-0"
      onClick={() => onTransactionClick(transaction)}
      variant="ghost"
      asChild
    >
      <li className="grid grid-cols-12">
        <div className="flex flex-col col-span-3">
          <p className="text-xs text-zinc-600 dark:text-white text-ellipsis overflow-hidden">
            {getCategory()}
          </p>
          <p
            className="mt-0.5 text-muted-foreground text-ellipsis overflow-hidden"
            style={{ fontSize: '11px' }}
          >
            {getSubcategory()}
          </p>
        </div>
        <div className="col-span-6 text-ellipsis overflow-hidden px-1">
          <p className="text-xs text-zinc-600 dark:text-white">
            {transaction.note}
          </p>
          <p
            className="mt-0.5 text-muted-foreground"
            style={{ fontSize: '11px' }}
          >
            {getBankName(transaction.type)}
          </p>
        </div>
        <div className="col-span-3 text-right">
          <p
            className={cn('text-xs font-mono', {
              'text-green-600 dark:text-green-400':
                transaction.type === TransactionType.INCOME,
              'text-red-600 dark:text-red-400':
                transaction.type === TransactionType.EXPENSE,
            })}
          >
            ${Math.abs(transaction.amount).toFixed(2)}
          </p>
        </div>
      </li>
    </Button>
  );
};
