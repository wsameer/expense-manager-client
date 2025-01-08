import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ChevronRight,
  Coins,
  CreditCard,
  Import,
  Moon,
  PiggyBank,
  Search,
  Sun,
  WalletCards,
} from 'lucide-react';
import { z } from 'zod';

import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ListGroup } from '@/components/list-group';
import { ListItem } from '@/components/list-group/list-item';

import { useTheme } from '../theme/theme-provider';
import {
  EXPENSE_CATEGORY_SETTINGS_ROUTE,
  DATA_SETTINGS_ROUTE,
  INCOME_CATEGORY_SETTINGS_ROUTE,
} from '@/router/routes';
import { useAuth } from '@/hooks';

export const Settings = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();
  const { t } = useTranslation('common', {
    keyPrefix: 'settings',
  });

  const onSettingItemClick = (url: string) => navigate(url);

  /**
   * @TODO
   */
  const searchFormSchema = z.object({
    query: z
      .string()
      .min(1, 'Search query cannot be empty')
      .max(100, 'Search query is too long'),
  });

  return (
    <div
      id="app-settings"
      className="grid grid-cols-1 gap-6"
    >
      <form className="ml-auto w-full sm:flex-initial">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
          />
        </div>
      </form>

      <ListGroup title="Appearance">
        <ListItem
          icon={
            theme === 'dark' ? (
              <Moon className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
            ) : (
              <Sun className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
            )
          }
          label="Dark Mode (Beta)"
          rightElement={
            <Switch
              className="w-10"
              checked={theme === 'dark'}
              onCheckedChange={() =>
                setTheme(theme === 'dark' ? 'light' : 'dark')
              }
            />
          }
        />
      </ListGroup>

      <ListGroup title="Category/Accounts">
        <ListItem
          icon={<Coins className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />}
          label={'Income Category Setting'}
          onClick={() => onSettingItemClick(INCOME_CATEGORY_SETTINGS_ROUTE)}
          rightElement={
            <ChevronRight className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
          }
        />
        <ListItem
          icon={
            <WalletCards className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
          }
          label={'Expense Category Setting'}
          onClick={() => onSettingItemClick(EXPENSE_CATEGORY_SETTINGS_ROUTE)}
          rightElement={
            <ChevronRight className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
          }
        />
        <ListItem
          icon={
            <CreditCard className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
          }
          label={'Accounts Setting'}
          rightElement={
            <ChevronRight className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
          }
        />
        <ListItem
          icon={
            <PiggyBank className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
          }
          label={'Budget Setting'}
          rightElement={
            <ChevronRight className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
          }
        />
        <ListItem
          icon={<Import className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />}
          label={'Data Setting'}
          onClick={() => onSettingItemClick(DATA_SETTINGS_ROUTE)}
          rightElement={
            <ChevronRight className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
          }
        />
      </ListGroup>

      <Button
        className="mb-6 w-full border-solid border border-zinc-300"
        variant="secondary"
        onClick={logout}
      >
        {t('logout')}
      </Button>
    </div>
  );
};
