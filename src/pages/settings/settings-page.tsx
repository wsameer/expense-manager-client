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
  USER_PROFILE_ROUTE,
} from '@/app/router/routes';
import { Button } from '@/components/ui/button';
import { SECONDARY_NAV } from '@/components/navigation/constants';
import { useResponsive } from '@/hooks/use-responsive';
import { useAuth } from '@/hooks/use-auth';
import { Link } from '@/components/ui/link';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

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
    <PageLayout
      title="Settings"
      rightElement={
        <Button
          className="rounded-full"
          size="icon"
          variant="outline"
          asChild
        >
          <Link to={USER_PROFILE_ROUTE}>
            <Avatar className="w-auto h-auto">
              <AvatarFallback className="bg-transparent">ST</AvatarFallback>
            </Avatar>
          </Link>
        </Button>
      }
    >
      <div
        id="app-settings"
        className={cn('grid grid-cols-1 gap-6 w-full', isDesktop && 'w-1/3')}
      >
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

        <ListGroup title={'Settings'}>
          {SECONDARY_NAV.map((item, index) => (
            <ListItem
              key={item.label + index}
              icon={<item.icon />}
              onClick={() => onSettingItemClick(item.path)}
              label={item.label}
            />
          ))}
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
