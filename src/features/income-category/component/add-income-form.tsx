import { useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
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
import { Textarea } from '@/components/ui/textarea';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';

import { IncomeCategory } from '../types';
import { useIncomeCategories } from '../api/use-categories';

type Props = {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  selectedCategory?: IncomeCategory;
};

const FormSchema = z.object({
  categoryName: z.string().min(2, {
    message: 'Category name must be at least 2 characters.',
  }),
  description: z.optional(z.string()),
});

export const AddIncomeCategoryForm = ({
  selectedCategory = undefined,
  onOpenChange,
  open,
}: Props) => {
  const { isMobile } = useResponsive();
  const { t } = useTranslation();
  const { createCategory, updateCategory } = useIncomeCategories();

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
          description: values.description ?? '',
        });
      } else {
        await createCategory({
          name: values.categoryName,
          description: values.description ?? '',
        });
      }
      form.reset();
      return onOpenChange(false);
    } catch (error: unknown) {
      toast({
        title: 'Operation failed!',
        description: error.message,
      });
    }
  };

  useEffect(() => {
    form.reset({
      categoryName: selectedCategory?.name ?? '',
      description: selectedCategory?.description ?? '',
    });
  }, [selectedCategory, form]);

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
        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="description">
                {t('categories:description')}
              </FormLabel>
              <Textarea
                placeholder="Type your description here"
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

  if (isMobile) {
    return (
      <Drawer
        open={open}
        onOpenChange={onOpenChange}
      >
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>{t('categories:income.income-category')}</DrawerTitle>
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
          <DialogTitle>{t('categories:income.income-category')}</DialogTitle>
        </DialogHeader>
        {renderForm()}
      </DialogContent>
    </Dialog>
  );
};
