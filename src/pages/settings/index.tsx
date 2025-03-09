import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  Coins,
  CreditCard,
  Import,
  Moon,
  PiggyBank,
  Sun,
  WalletCards,
} from 'lucide-react';

import { useResponsive, useAuth } from '@/hooks';
import { PageLayout } from '@/components/layout/page-layout';
import { useTheme } from '@/features/theme/theme-provider';
import { cn } from '@/lib/utils';
import { ListGroup } from '@/components/list-group';
import { ListItem } from '@/components/list-group/list-item';
import { Switch } from '@/components/ui/switch';
import {
  ACCOUNT_SETTINGS_ROUTE,
  DATA_SETTINGS_ROUTE,
  EXPENSE_CATEGORY_SETTINGS_ROUTE,
  INCOME_CATEGORY_SETTINGS_ROUTE,
} from '@/app/router/routes';
import { Button } from '@/components/ui/button';

export const SettingsPage = () => {
  const navigate = useNavigate();
  const { isDesktop } = useResponsive();
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();
  const { t } = useTranslation('common', {
    keyPrefix: 'settings',
  });

  const onSettingItemClick = (url: string) => navigate(url);

  return (
    <PageLayout title="Settings">
      <div className="flex flex-col min-w-0 md:hidden">
        <h2 className="text-3xl font-normal text-foreground tracking-tight">
          Settings
        </h2>
      </div>

      <div
        id="app-settings"
        className={cn('grid grid-cols-1 gap-6 w-full', isDesktop && 'w-3/5')}
      >
        {/* <form className="ml-auto w-full sm:flex-initial md:hidden">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search settings..."
              className="pl-8 rounded-full"
            />
          </div>
        </form> */}

        <ListGroup title="Appearance">
          <ListItem
            icon={
              theme === 'dark' ? (
                <Moon className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
              ) : (
                <Sun className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
              )
            }
            label="Dark Mode"
            rightElement={
              <Switch
                className="w-9"
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
            icon={
              <Coins className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
            }
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
            onClick={() => onSettingItemClick(ACCOUNT_SETTINGS_ROUTE)}
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
            icon={
              <Import className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
            }
            label={'Data Setting'}
            onClick={() => onSettingItemClick(DATA_SETTINGS_ROUTE)}
            rightElement={
              <ChevronRight className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
            }
          />
        </ListGroup>

        <Button
          className="mb-6 w-full h-12 rounded-full block md:hidden"
          variant="destructive"
          onClick={logout}
        >
          {t('logout')}
        </Button>
      </div>
    </PageLayout>
  );
};
