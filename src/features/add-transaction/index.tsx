import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { useResponsive } from '@/hooks/use-responsive';
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerHeader,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { useTranslation } from 'react-i18next';
import { TransactionType } from '@/types';
import { Transactions } from './components/transactions';
import { useUiStore } from '@/store/uiStore';

export const AddTransaction = () => {
  const { t } = useTranslation('transaction');
  const [open, setOpen] = useState(false);
  const { selectedTransactionType } = useUiStore();
  const { isMobile } = useResponsive();

  const tabTitle = useMemo(
    () =>
      selectedTransactionType === TransactionType.TRANSFER
        ? 'transfer'
        : selectedTransactionType,
    [selectedTransactionType],
  );

  if (isMobile) {
    return (
      <Drawer
        open={open}
        onOpenChange={setOpen}
        repositionInputs={false}
      >
        <DrawerTrigger asChild>
          <Button
            className="rounded-full h-11 w-11"
            variant="destructive"
            size="icon"
          >
            <div className="flex flex-col items-center justify-center">
              <Plus />
            </div>
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full">
            <DrawerHeader className="text-left">
              <DrawerTitle className="text-2xl font-light">
                Record{' '}
                {selectedTransactionType === TransactionType.TRANSFER
                  ? 'a'
                  : 'an'}{' '}
                {tabTitle}
              </DrawerTitle>
            </DrawerHeader>
            <div className="px-4">
              <Transactions setOpen={setOpen} />
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <div className={'fixed bottom-6 right-6'}>
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
                ? 'a'
                : 'an'}{' '}
              {tabTitle}
            </DialogTitle>
            <DialogDescription>
              {t('enter-and-submit-your-transaction')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 pt-4">
            <Transactions setOpen={setOpen} />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="submit"
                className="w-full rounded-full text-md"
                size="lg"
              >
                {t('cancel')}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
