import { API_BASE_URL } from "@/lib/constants";

export const ACCOUNTS_API = API_BASE_URL + 'accounts';
export const ACCOUNT_BY_ID_API = API_BASE_URL + 'accounts/:id';
export const ACCOUNTS_STATS_API = API_BASE_URL + 'accounts-stats';

export const ACCOUNT_GROUPS = [
  { key: 'CASH', label: 'cash', id: 1 },
  { key: 'CHEQUING', label: 'chequing', id: 2 },
  { key: 'SAVINGS', label: 'savings', id: 3 },
  { key: 'CREDIT_CARD', label: 'credit card', id: 4 },
  { key: 'INVESTMENTS', label: 'investments', id: 5 },
];

export const CREDIT_CARD = 'CREDIT_CARD';
