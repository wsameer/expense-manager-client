import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

import { SideNavigationItem } from '../types';
import { NavLink, useLocation } from 'react-router-dom';

export const NavMain = ({ items }: { items: SideNavigationItem[] }) => {
  const location = useLocation();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.path}>
            <SidebarMenuButton
              tooltip={item.label}
              isActive={location.pathname === item.path}
              asChild
            >
              <NavLink to={item.path}>
                {item.icon && <item.icon />}
                <span>{item.label}</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};
