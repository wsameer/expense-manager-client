import React from 'react';
import { Settings2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { AddTransaction } from '@/features/add-transaction';
import { PRIMARY_NAV } from '../constants';
import { NavItem } from './nav-item';

export const AppBottomBar = () => {
  const navigate = useNavigate();

  // const date = new Date();
  // const day = date.getDate().toString().padStart(2, '0');
  // const month = date.toLocaleString('default', { month: 'short' });

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-3/4 z-10 block md:hidden">
      <nav className="flex items-center justify-between rounded-full bg-zinc-800 dark:bg-zinc-800 dark:border dark:border-zinc-900 p-2 shadow-lg">
        {PRIMARY_NAV.slice(0, -1).map((item, index) => {
          const Icon = item.icon;
          return (
            <React.Fragment key={item.path}>
              <NavItem
                icon={<Icon />}
                isActive={location.pathname === item.path}
                label={item.label}
                onClick={() => navigate(item.path)}
              />
              {index === 1 && <AddTransaction />}
            </React.Fragment>
          );
        })}
        <NavItem
          icon={<Settings2 />}
          isActive={location.pathname.includes(
            PRIMARY_NAV[PRIMARY_NAV.length - 1].path,
          )}
          label={PRIMARY_NAV[PRIMARY_NAV.length - 1].label}
          onClick={() => navigate(PRIMARY_NAV[PRIMARY_NAV.length - 1].path)}
        />
      </nav>
    </div>
  );
};
