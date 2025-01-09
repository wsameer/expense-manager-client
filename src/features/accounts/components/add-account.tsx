import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';

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
import { useResponsive } from '@/hooks';
import { AccountForm } from './account-form';
import { AccountGroupEnum } from '../types';

export const AddAccount = ({ group }: { group: AccountGroupEnum }) => {
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
            className="w-full rounded-xl border-zinc-400"
            variant="dashed"
          >
            <Plus className="h-4 w-4 mr-2" />
            <p>{t('add-new-account')}</p>
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>{t('add-new-account')}</DrawerTitle>
          </DrawerHeader>
          <AccountForm
            className="px-4"
            group={group}
            setOpen={setOpen}
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
          <Plus className="h-5 w-5 mr-2" />
          <p>{t('add-new-account')}</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('add-new-account')}</DialogTitle>
        </DialogHeader>
        <AccountForm
          group={group}
          setOpen={setOpen}
        />
      </DialogContent>
    </Dialog>
  );
};
