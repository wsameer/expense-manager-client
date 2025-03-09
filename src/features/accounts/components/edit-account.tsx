import * as React from 'react';
import { Pencil } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerHeader,
  DrawerTrigger,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer';
import { useResponsive } from '@/hooks/use-responsive';
import { AccountForm } from './account-form';
import { AccountGroupEnum } from '../types';

type Props = {
  group: AccountGroupEnum;
  name: string;
  description: string;
  paymentAccountId?: number | undefined;
  balance: number;
  accountId: number;
};

export const EditAccount = ({
  group,
  name,
  description,
  paymentAccountId,
  balance,
  accountId,
}: Props) => {
  const { t } = useTranslation('account', {
    keyPrefix: 'create-account-form',
  });
  const [open, setOpen] = React.useState(false);
  const { isMobile } = useResponsive();

  if (isMobile) {
    return (
      <Drawer
        open={open}
        onOpenChange={setOpen}
      >
        <DrawerTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>{t('edit-an-account')}</DrawerTitle>
          </DrawerHeader>

          <AccountForm
            className="px-4"
            name={name}
            group={group}
            paymentAccountId={paymentAccountId}
            description={description}
            balance={balance}
            setOpen={setOpen}
            editMode={accountId}
          />

          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">{t('cancel')}</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          className="w-full"
          variant="secondary"
        >
          <p>{t('edit')}</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('edit-an-account')}</DialogTitle>
        </DialogHeader>
        <AccountForm
          name={name}
          group={group}
          paymentAccountId={paymentAccountId}
          description={description}
          balance={balance}
          setOpen={setOpen}
          editMode={accountId}
        />
      </DialogContent>
    </Dialog>
  );
};
