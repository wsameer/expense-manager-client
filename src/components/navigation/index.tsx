import React from 'react';
import {
  CreditCardIcon,
  FileTextIcon,
  HouseIcon,
  Settings,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useResponsive } from '@/hooks';
import { SideNavigationItem } from './types';
import { BrandLogo } from './brand-logo';
import { NavItem } from './nav-item';
import {
  ACCOUNTS_ROUTE,
  DASHBOARD_ROUTE,
  SETTINGS_ROUTE,
  TRANSACTIONS_ROUTE,
} from '@/router/routes';
import { AddTransaction } from '@/features/add-transaction';
import { NavigationButton } from './navbar-button';

export const Navigation = () => {
  const { isMobile } = useResponsive();
  const navigate = useNavigate();

  const date = new Date();
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleString('default', { month: 'short' });

  const navItems = [
    { icon: HouseIcon, label: 'Home', path: DASHBOARD_ROUTE },
    {
      icon: FileTextIcon,
      label: `${day}-${month}`,
      path: TRANSACTIONS_ROUTE,
    },
    { icon: CreditCardIcon, label: 'Accounts', path: ACCOUNTS_ROUTE },
    { icon: Settings, label: 'Settings', path: SETTINGS_ROUTE },
  ].filter(Boolean) as SideNavigationItem[];

  if (isMobile) {
    return (
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[80%] z-10">
        <nav className="flex items-center justify-between rounded-full bg-zinc-800 dark:border dark:border-zinc-900 p-2 shadow">
          {navItems.slice(0, -1).map((item, index) => {
            const Icon = item.icon;
            return (
              <React.Fragment key={item.path}>
                <NavigationButton
                  icon={<Icon />}
                  isActive={location.pathname === item.path}
                  label={item.label}
                  onClick={() => navigate(item.path)}
                />
                {index === 1 && <AddTransaction />}
              </React.Fragment>
            );
          })}
          <NavigationButton
            icon={<Settings />}
            isActive={location.pathname.includes(
              navItems[navItems.length - 1].path,
            )}
            label={navItems[navItems.length - 1].label}
            onClick={() => navigate(navItems[navItems.length - 1].path)}
          />
        </nav>
      </div>
    );
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <BrandLogo />
        {navItems.slice(0, -1).map((item) => (
          <NavItem
            key={item.label}
            item={item}
          />
        ))}
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <NavItem item={navItems[navItems.length - 1]} />
      </nav>
    </aside>
  );
};
