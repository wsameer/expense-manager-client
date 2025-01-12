import { useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Category, Subcategory } from '../types';
import { useExpenseSubcategories } from '../api/use-subcategories';

type Props = {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  onCategoryAdded: () => void;
  selectedCategory: Category;
  selectedSubcategory: Subcategory | undefined;
};

const FormSchema = z.object({
  categoryName: z.string().min(2, {
    message: 'Category name must be at least 2 characters.',
  }),
  subCategoryName: z.string().min(2, {
    message: 'Subcategory name must be at least 2 characters.',
  }),
});

export const AddExpenseSubCategory = ({
  open,
  onOpenChange,
  onCategoryAdded,
  selectedCategory,
  selectedSubcategory,
}: Props) => {
  const { t } = useTranslation();
  const { isMobile } = useResponsive();
  const { createSubcategory, updateSubcategory } = useExpenseSubcategories(
    selectedCategory.id,
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      subCategoryName: selectedSubcategory?.name || '',
      categoryName: selectedCategory.name,
    },
  });

  const handleExpenseSubcategorySubmit = async (
    values: z.infer<typeof FormSchema>,
  ) => {
    if (!values) return false;

    const isEditing = !!selectedSubcategory;

    try {
      if (!isEditing) {
        await createSubcategory({ name: values.subCategoryName });
      } else {
        await updateSubcategory(selectedSubcategory?.id, {
          name: values.subCategoryName,
        });
      }
      onCategoryAdded(); // mutate Category API
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
    <Form
      key={selectedCategory.id}
      {...form}
    >
      <form
        onSubmit={form.handleSubmit(handleExpenseSubcategorySubmit)}
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
                placeholder="Category Name"
                value={selectedCategory.name}
                readOnly
              />
            </FormItem>
          )}
        />
        <FormField
          name="subCategoryName"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="subCategoryName">
                {t('categories:subcategory-name')}
              </FormLabel>
              <Input
                placeholder="Subcategory Name"
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
          {selectedSubcategory
            ? t('categories:save-changes')
            : t('categories:expense.create-subcategory')}
        </Button>
      </form>
    </Form>
  );

  useEffect(() => {
    form.reset(
      {
        categoryName: selectedCategory?.name || '',
        subCategoryName: selectedSubcategory?.name || '',
      },
      {
        keepDefaultValues: false, // Ensure it completely resets
      },
    );
  }, [selectedCategory, selectedSubcategory, form]);

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
