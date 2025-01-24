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
      <nav className="fixed z-50 w-11/12 h-16 max-w-lg -translate-x-1/2 bg-zinc-900 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-900 rounded-full bottom-8 left-1/2">
        <div className="grid h-full max-w-lg grid-cols-5 place-items-center place-content-center p-2 gap-2">
          {navItems.slice(0, -1).map((item, index) => (
            <React.Fragment key={item.path}>
              <button
                className={cn(
                  'inline-flex flex-col items-center justify-center rounded-full w-12 h-12 px-3 hover:text-white hover:bg-zinc-700 dark:hover:bg-zinc-900',
                  {
                    'text-white bg-zinc-700 dark:bg-zinc-900':
                      location.pathname === item.path,
                    'text-zinc-500 ': location.pathname !== item.path,
                  },
                )}
                onClick={() => navigate(item.path)}
              >
                <div className="flex flex-col items-center justify-center">
                  <item.icon className="h-5 w-5" />
                </div>
              </button>
              {index === 1 && <AddTransaction />}
            </React.Fragment>
          ))}

          <button
            className={cn(
              'inline-flex flex-col items-center justify-center rounded-full w-12 h-12 px-3 text-zinc-500 hover:text-white hover:bg-zinc-700 dark:hover:bg-zinc-900',
              {
                'text-white bg-zinc-700 dark:bg-zinc-900':
                  location.pathname.includes(
                    navItems[navItems.length - 1].path,
                  ),
              },
            )}
            onClick={() => navigate(navItems[navItems.length - 1].path)}
          >
            <div className="flex flex-col items-center justify-center">
              <EllipsisIcon className="h-5 w-5" />
            </div>
          </button>
        </div>
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
