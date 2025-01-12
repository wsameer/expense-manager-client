import { useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast, useResponsive } from '@/hooks';
import { Category } from '../types';
import { useTranslation } from 'react-i18next';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { useExpenseCategories } from '../api/use-expense-categories';

type Props = {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  selectedCategory?: Category;
};

const FormSchema = z.object({
  categoryName: z.string().min(2, {
    message: 'Category Name must be at least 2 characters.',
  }),
});

export const AddExpenseCategoryForm = ({
  selectedCategory = undefined,
  onOpenChange,
  open,
}: Props) => {
  const { t } = useTranslation();
  const { isMobile } = useResponsive();
  const { createCategory, updateCategory, refetchExpenseCategories } =
    useExpenseCategories();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const handleExpenseCategorySubmit = async (
    values: z.infer<typeof FormSchema>,
  ) => {
    if (!values) return false;

    const isEditing = !!selectedCategory;
    try {
      if (isEditing) {
        await updateCategory(selectedCategory.id.toString(), {
          name: values.categoryName,
        });
      } else {
        await createCategory({ name: values.categoryName });
      }
      refetchExpenseCategories();
      form.reset();
      return onOpenChange(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        title: 'Operation failed!',
        description: error.message,
      });
    }
  };

  const renderForm = () => (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleExpenseCategorySubmit)}
        className="space-y-6"
      >
        <FormField
          name="categoryName"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="categoryName">
                {t('categories:category-name')}
              </FormLabel>
              <Input
                placeholder="Category Name"
                {...field}
              />
              <FormMessage role="alert" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
        >
          {selectedCategory
            ? t('categories:save-changes')
            : t('categories:create')}
        </Button>
      </form>
    </Form>
  );

  useEffect(() => {
    form.reset({
      categoryName: selectedCategory ? selectedCategory.name : '',
    });
  }, [selectedCategory, form]);

  if (isMobile) {
    return (
      <Drawer
        open={open}
        onOpenChange={onOpenChange}
      >
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>
              {t('categories:expense.expense-category')}
            </DrawerTitle>
          </DrawerHeader>
          <div className="px-4">{renderForm()}</div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">{t('common:cancel')}</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('categories:expense.expense-category')}</DialogTitle>
        </DialogHeader>
        {renderForm()}
      </DialogContent>
    </Dialog>
  );
};
