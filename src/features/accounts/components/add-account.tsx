import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';

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
  DrawerTitle,
  DrawerHeader,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useResponsive } from '@/hooks/use-responsive';
import { AccountForm } from './account-form';
import { AccountGroupEnum } from '../types';

export const AddAccount = ({ group }: { group: AccountGroupEnum }) => {
  const { t } = useTranslation('account', {
    keyPrefix: 'create-account-form',
  });
  const [open, setOpen] = React.useState(false);
  const { isMobile } = useResponsive();
  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (isMobile) {
    return (
      <Drawer
        open={open}
        onOpenChange={setOpen}
      >
        <DrawerTrigger asChild>
          <Button
            className="bg-white dark:bg-muted hover:bg-muted dark:hover:bg-background rounded-xl"
            variant="dashed"
            size="icon"
            onClick={handleTriggerClick}
          >
            <Plus />
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
          className="rounded-xl"
          variant="dashed"
          size="icon"
        >
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('add-new-account')}</DialogTitle>
          <DialogDescription>{t('new-account-hint')}</DialogDescription>
        </DialogHeader>
        <AccountForm
          group={group}
          setOpen={setOpen}
        />
      </DialogContent>
    </Dialog>
  );
};
