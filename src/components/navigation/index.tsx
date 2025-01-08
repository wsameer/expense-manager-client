import React from 'react';
import {
  CreditCardIcon,
  EllipsisIcon,
  FileTextIcon,
  HomeIcon,
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
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { AddTransaction } from '@/features/add-transaction';

export const Navigation = () => {
  const { isMobile } = useResponsive();
  const navigate = useNavigate();

  const date = new Date();
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleString('default', { month: 'short' });

  const navItems = [
    { icon: HomeIcon, label: 'Home', path: DASHBOARD_ROUTE },
    {
      icon: FileTextIcon,
      label: `${day}-${month}`,
      path: TRANSACTIONS_ROUTE,
    },
    { icon: CreditCardIcon, label: 'Accounts', path: ACCOUNTS_ROUTE },
    { icon: Settings, label: 'More', path: SETTINGS_ROUTE },
  ].filter(Boolean) as SideNavigationItem[];

  if (isMobile) {
    return (
      <nav className="fixed px-3 bottom-0 left-0 right-0 grid grid-cols-5 gap-3 justify-items-center items-center bg-white dark:bg-zinc-800 border-t border-zinc-200 dark:border-zinc-900 h-20 z-10">
        {navItems.slice(0, -1).map((item, index) => (
          <React.Fragment key={item.path}>
            <Button
              variant="ghost"
              size="icon"
              className={cn('p-0 hover:bg-white dark:hover:bg-zinc-800', {
                'text-zinc-800 dark:text-zinc-100':
                  location.pathname === item.path,
                'text-zinc-400 dark:hover:text-zinc-100':
                  location.pathname !== item.path,
              })}
              onClick={() => navigate(item.path)}
            >
              <div className="flex flex-col items-center justify-center">
                <item.icon className="h-5 w-5" />
                <p className="text-xs">{item.label}</p>
              </div>
            </Button>
            {index === 1 && <AddTransaction />}
          </React.Fragment>
        ))}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'p-0 hover:bg-white dark:hover:bg-zinc-800 text-zinc-400 dark:hover:text-zinc-100',
            {
              'text-zinc-400 dark:text-zinc-100': location.pathname.includes(
                navItems[navItems.length - 1].path,
              ),
            },
          )}
          onClick={() => navigate(navItems[navItems.length - 1].path)}
        >
          <div className="flex flex-col items-center justify-center">
            <EllipsisIcon className="h-5 w-5" />
            <p className="text-xs">{navItems[navItems.length - 1].label}</p>
          </div>
        </Button>
      </nav>
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
