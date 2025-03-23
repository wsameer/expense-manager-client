import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useResponsive } from '@/hooks/use-responsive';
import { useUiStore } from '@/store/uiStore';
import { TransactionType } from '@/types';
import { Transactions } from './components/transactions';

export function AddTransaction() {
  const { t } = useTranslation('transaction');
  const [open, setOpen] = useState(false);
  const { selectedTransactionType } = useUiStore();
  const { isDesktop } = useResponsive();

  const tabTitle = React.useMemo(
    () =>
      selectedTransactionType === TransactionType.TRANSFER
        ? 'transfer'
        : selectedTransactionType,
    [selectedTransactionType],
  );

  if (isDesktop) {
    return (
      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogTrigger asChild>
          <Button
            className="rounded-full h-12 w-12 hover:bg-red-700"
            variant="destructive"
            size="icon"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Record{' '}
              {selectedTransactionType === TransactionType.TRANSFER
                ? ' a '
                : ' an '}
              {tabTitle}
            </DialogTitle>
            <DialogDescription>
              {t('enter-and-submit-your-transaction')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 pt-4">
            <Transactions setOpen={setOpen} />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
    >
      <DrawerTrigger asChild>
        <Button
          className="rounded-full h-12 w-12 hover:bg-red-700"
          variant="destructive"
          size="icon"
        >
          <Plus />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-2xl font-light">
            Record
            {selectedTransactionType === TransactionType.TRANSFER
              ? ' a '
              : ' an '}
            {tabTitle}
          </DrawerTitle>
        </DrawerHeader>
        <div className="px-4 mb-10">
          <Transactions setOpen={setOpen} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
