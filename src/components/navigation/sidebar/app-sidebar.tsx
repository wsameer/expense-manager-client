'use client';

import * as React from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { BrandLogoDesktop } from './brand-logo-desktop';
import { NavMain } from './nav-main';
import { NavUser } from './nav-user';
import { useAuth } from '@/hooks';
import { NavSecondary } from './nav-secondary';
import { APP_META_DATA, PRIMARY_NAV, SECONDARY_NAV } from '../constants';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  return (
    <Sidebar
      collapsible="icon"
      className="block sm:hidden"
      {...props}
    >
      <SidebarHeader>
        <BrandLogoDesktop team={APP_META_DATA} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={PRIMARY_NAV} />
        <NavSecondary
          items={SECONDARY_NAV}
          className="mt-auto"
        />
      </SidebarContent>
      <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
