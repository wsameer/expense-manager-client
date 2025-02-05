import { HouseIcon, FileTextIcon, CreditCardIcon, Settings, Wallet2, LifeBuoy, Send } from "lucide-react";

import { DASHBOARD_ROUTE, TRANSACTIONS_ROUTE, ACCOUNTS_ROUTE, SETTINGS_ROUTE } from "@/router/routes";

import { SideNavigationItem } from "./types";

export const PRIMARY_NAV = [
  { icon: HouseIcon, label: 'Home', path: DASHBOARD_ROUTE },
  {
    icon: FileTextIcon,
    label: 'Transactions',
    path: TRANSACTIONS_ROUTE,
  },
  { icon: CreditCardIcon, label: 'Accounts', path: ACCOUNTS_ROUTE },
  { icon: Settings, label: 'Settings', path: SETTINGS_ROUTE },
].filter(Boolean) as SideNavigationItem[];

export const APP_META_DATA = {
  name: 'Budget Tracker',
  logo: Wallet2,
  plan: 'Enterprise',
};

export const SECONDARY_NAV = [
  {
    label: "Support",
    path: "#",
    icon: LifeBuoy,
  },
  {
    label: "Feedback",
    path: "#",
    icon: Send,
  },
].filter(Boolean) as SideNavigationItem[];