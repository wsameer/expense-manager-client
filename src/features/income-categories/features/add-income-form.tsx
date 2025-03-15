/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
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
import { Textarea } from '@/components/ui/textarea';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';

import { IncomeCategory } from '../types';
import { useIncomeCategories } from '../api/use-categories';
import { Trash2 } from 'lucide-react';
import { useResponsive } from '@/hooks/use-responsive';
import { toast } from '@/hooks/use-toast';

type Props = {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  selectedCategory?: IncomeCategory;
  handleOnDelete?: (categoryId: number) => void;
};

const FormSchema = z.object({
  categoryName: z.string().min(2, {
    message: 'Category name must be at least 2 characters.',
  }),
  description: z.optional(z.string()),
});

export const AddIncomeCategoryForm = ({
  open,
  selectedCategory = undefined,
  onOpenChange,
  handleOnDelete,
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
        await updateCategory(selectedCategory.id, {
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
    } catch (error: any) {
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
                {...field}
                placeholder={t('categories:category-name')}
                className="text-sm"
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
                {...field}
                placeholder={t('categories:description-hint')}
                className="text-sm"
              />
              <FormMessage role="alert" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full rounded-full text-md"
          size="lg"
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
        repositionInputs={false}
      >
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle className="flex justify-between">
              {t('categories:income.income-category')}
              {selectedCategory && (
                <Button
                  className="text-red-500 hover:text-red-600 hover:bg-red-100"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleOnDelete?.(selectedCategory.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </DrawerTitle>
            <DialogDescription></DialogDescription>
          </DrawerHeader>
          <div className="px-4">{renderForm()}</div>
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
