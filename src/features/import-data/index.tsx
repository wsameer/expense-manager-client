import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileUp } from 'lucide-react';

import { ListItem } from '@/components/list-group/list-item';
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
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useResponsive } from '@/hooks/use-responsive';
import { ImportCsvForm } from './form';

export const ImportDataDialog = () => {
  const [open, setOpen] = useState(false);

  const { isDesktop } = useResponsive();

  const { t } = useTranslation('settings');

  if (isDesktop) {
    return (
      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogTrigger asChild>
          <ListItem
            icon={
              <FileUp className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
            }
            label={t('import-from-csv')}
            rightElement={undefined}
          />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('data.upload-csv-file')}</DialogTitle>
            <DialogDescription>{t('data.upload-csv-hint')}</DialogDescription>
          </DialogHeader>
          {open && <ImportCsvForm />}
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
        <ListItem
          icon={<FileUp className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />}
          label={t('import-from-csv')}
          rightElement={undefined}
        />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{t('data.upload-csv-file')}</DrawerTitle>
          <DrawerDescription>{t('data.upload-csv-hint')}</DrawerDescription>
        </DrawerHeader>

        {open && <ImportCsvForm />}

        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button
              variant="destructive"
              onClick={() => setOpen(false)}
            >
              {t('data.cancel')}
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
