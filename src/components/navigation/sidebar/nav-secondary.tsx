import * as React from 'react';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { SideNavigationItem } from '../types';
import { NavLink } from 'react-router-dom';

export function NavSecondary({
  items,
  ...props
}: {
  items: SideNavigationItem[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton
                tooltip={item.label}
                asChild
                size="sm"
                isActive={location.pathname === item.path}
              >
                <NavLink to={item.path}>
                  {item.icon && <item.icon />}
                  <span>{item.label}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
