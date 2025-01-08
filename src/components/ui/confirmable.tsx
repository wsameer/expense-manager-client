import React, { createContext, useContext, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './alert-dialog';

type ConfirmDialogOptions = {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
};

interface ConfirmDialogContextType {
  openConfirmDialog: (options: ConfirmDialogOptions) => void;
}

const ConfirmDialogContext = createContext<
  ConfirmDialogContextType | undefined
>(undefined);

export const ConfirmDialogProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogOptions, setDialogOptions] =
    useState<ConfirmDialogOptions | null>(null);

  const openConfirmDialog = (options: ConfirmDialogOptions) => {
    setDialogOptions(options);
    setDialogOpen(true);
  };

  const handleConfirm = () => {
    setDialogOpen(false);
    dialogOptions?.onConfirm();
  };

  const handleCancel = () => {
    setDialogOpen(false);
    dialogOptions?.onCancel?.();
  };

  return (
    <ConfirmDialogContext.Provider value={{ openConfirmDialog }}>
      {children}
      <AlertDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogOptions?.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {dialogOptions?.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleConfirm}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ConfirmDialogContext.Provider>
  );
};

// Create a custom hook to use the context
export const useConfirmDialog = () => {
  const context = useContext(ConfirmDialogContext);
  if (context === undefined) {
    throw new Error(
      'useConfirmDialog must be used within a ConfirmDialogProvider',
    );
  }
  return context;
};
