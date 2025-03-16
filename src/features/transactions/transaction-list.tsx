import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';

import { EmptyData } from '@/components/shared/empty-data';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { TransactionType } from '@/types';
import { formatDateToYYYYMM } from '@/lib/utils';
import { Transactions } from '@/features/add-transaction/components/transactions';
import { useConfirmDialog } from '@/components/ui/confirmable';
import { toast } from '@/hooks/use-toast';
import { ErrorMessage } from '@/components/errors/error-message';
import { useUiStore } from '@/store/uiStore';

import { useDeleteTransaction } from './api/delete-transaction';
import { Transaction } from './types';
import { calculateTotalsByType, groupTransactionsByDate } from './utils';
import { TransactionItem } from './components/transaction-item';
import { useTransactions } from './api/get-transaction';
import { TListLoader } from './components/list-loader';
import { MonthlyStats } from './components/monthly-stats';
import { useResponsive } from '@/hooks/use-responsive';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

export const TransactionList = () => {
  const { selectedDate, selectedTransactionType, setSelectedTransactionType } =
    useUiStore();
  const { t } = useTranslation(['transaction', 'common']);
  const { openConfirmDialog } = useConfirmDialog();
  const { isDesktop } = useResponsive();

  const { allTransactions, isError, isLoading } = useTransactions(
    formatDateToYYYYMM(selectedDate),
  );

  const { deleteTransaction } = useDeleteTransaction(
    formatDateToYYYYMM(selectedDate),
  );

  const [open, setOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction>();

  const onTransactionClick = (t: Transaction) => {
    setSelectedTransactionType(t.type);
    setTransactionToEdit(t);
    setOpen(true);
  };

  const tabTitle = useMemo(
    () =>
      selectedTransactionType === TransactionType.TRANSFER
        ? 'transfer'
        : selectedTransactionType,
    [selectedTransactionType],
  );

  const handleDeleteTransaction = (id: number) => {
    openConfirmDialog({
      title: t('common:alert.are-you-sure'),
      message: t('transaction:delete-warning-message'),
      onConfirm: async () => {
        try {
          await deleteTransaction(id);
          setOpen(false);
          toast({
            title: t('common:alert.deleted'),
            description: t('transaction:transaction-is-deleted'),
          });
        } catch (error) {
          console.error('Error deleting account:', error);
          toast({
            title: t('common:errors.operation-failed'),
            description: t('transaction:failed-to-delete'),
          });
        }
      },
    });
  };

  if (isError) {
    return <ErrorMessage message={t('get-error-message')} />;
  }

  if (isLoading) {
    return <TListLoader />;
  }

  if (allTransactions?.length === 0) {
    return <EmptyData />;
  }

  const groupedTransactions = groupTransactionsByDate(allTransactions ?? []);
  const sortedDates = Object.keys(groupedTransactions).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  );

  const monthlyStats = calculateTotalsByType(allTransactions!);

  return (
    <div className="flex flex-wrap flex-col gap-4 mb-4">
      <MonthlyStats monthlyStats={monthlyStats} />

      {sortedDates.map((date: string) => (
        <div key={date}>
          <p className="text-sm mb-1">
            {new Date(`${date}T00:00:00`).toLocaleDateString('en-CA', {
              weekday: 'short',
              day: 'numeric',
            })}
          </p>
          <ul className="bg-background border dark:bg-zinc-800 rounded-xl overflow-hidden">
            {groupedTransactions[date].map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                onTransactionClick={onTransactionClick}
              />
            ))}
          </ul>
        </div>
      ))}

      {isDesktop ? (
        <Dialog
          open={open}
          onOpenChange={setOpen}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DrawerHeader className="flex justify-between items-center text-left">
              <DialogTitle>
                {t('record')}{' '}
                {selectedTransactionType === TransactionType.TRANSFER
                  ? 'a'
                  : 'an'}{' '}
                {tabTitle}
              </DialogTitle>
              <Button
                className="text-red-500 hover:text-red-700 h-6 w-6"
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteTransaction(transactionToEdit!.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </DrawerHeader>
            <Transactions
              setOpen={setOpen}
              data={transactionToEdit}
            />
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer
          open={open}
          onOpenChange={setOpen}
          repositionInputs={false}
        >
          <DrawerContent className="mx-auto w-full">
            <DrawerHeader className="flex justify-between items-center text-left">
              <DrawerTitle>
                {t('record')}{' '}
                {selectedTransactionType === TransactionType.TRANSFER
                  ? 'a'
                  : 'an'}{' '}
                {tabTitle}
              </DrawerTitle>
              <Button
                className="text-red-500 hover:text-red-700 h-6 w-6"
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteTransaction(transactionToEdit!.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </DrawerHeader>
            <div className="px-4">
              <Transactions
                setOpen={setOpen}
                data={transactionToEdit}
              />
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
};
