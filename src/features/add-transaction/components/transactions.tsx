import React, { useCallback, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TransactionType } from '@/types';
import { Transaction } from '@/features/transactions/types';
import { ExpenseForm } from './expense-form';
import { IncomeForm } from './income-form';
import { TransferForm } from './transfer-form';
import { useUiStore } from '@/store/uiStore';

type TransactionsProps = {
  setOpen: (value: boolean) => void;
  data?: Transaction;
};

export const Transactions: React.FC<TransactionsProps> = React.memo(
  ({ data, setOpen }) => {
    const transactionTypes = useMemo(() => Object.values(TransactionType), []);
    const { selectedTransactionType, setSelectedTransactionType } =
      useUiStore();

    const renderContent = useCallback(
      (type: TransactionType) => {
        switch (type) {
          case TransactionType.EXPENSE:
            return (
              <ExpenseForm
                setOpen={setOpen}
                existingData={data}
              />
            );
          case TransactionType.INCOME:
            return (
              <IncomeForm
                setOpen={setOpen}
                existingData={data}
              />
            );
          case TransactionType.TRANSFER:
            return (
              <TransferForm
                setOpen={setOpen}
                existingData={data}
              />
            );
          default:
            return null;
        }
      },
      [data, setOpen],
    );

    return (
      <Tabs
        defaultValue={selectedTransactionType}
        onValueChange={(value) =>
          setSelectedTransactionType(value as TransactionType)
        }
      >
        <TabsList className="grid w-full grid-cols-3">
          {transactionTypes.map((type) => (
            <TabsTrigger
              key={type}
              value={type}
              className="w-full text-center capitalize"
            >
              {type === TransactionType.TRANSFER ? 'Transfer' : type}
            </TabsTrigger>
          ))}
        </TabsList>
        {transactionTypes.map((type) => (
          <TabsContent
            key={type}
            value={type}
            className="mt-4"
          >
            {renderContent(type as TransactionType)}
          </TabsContent>
        ))}
      </Tabs>
    );
  },
);
