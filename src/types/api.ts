export type BaseEntity = {
  id: string;
  createdAt: number;
};

export type Entity<T> = {
  [K in keyof T]: T[K];
} & BaseEntity;

export enum AccountGroup {
  CASH = 'CASH',
  CHEQUING = 'CHEQUING',
  CREDIT_CARD = 'CREDIT_CARD',
  SAVINGS = 'SAVINGS',
  INVESTMENTS = 'INVESTMENTS',
}

export type Account = Entity<{
  name: string;
  group: AccountGroup;
  balance: number;
  description: string;
  paymentAccountId: number | null;
  id: number;
  user_id: number;
  updated_at: string; // date time
  created_at: string; // date time
}>;
