'use client';

import React from 'react';

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { NavLink } from 'react-router-dom';
import { DASHBOARD_ROUTE } from '@/app/router/routes';

export const BrandLogoDesktop = ({
  team,
}: {
  team: {
    name: string;
    logo: React.ElementType;
    plan: string;
  };
}) => (
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton
        size="lg"
        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        asChild
      >
        <NavLink to={DASHBOARD_ROUTE}>
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-foreground text-background">
            <team.logo className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{team.name}</span>
            <span className="truncate text-xs">{team.plan}</span>
          </div>
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
);
