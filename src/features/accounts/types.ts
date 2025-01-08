import { z } from 'zod';

const AccountGroupEnum = z.enum([
  'CASH',
  'CHEQUING',
  'CREDIT_CARD',
  'SAVINGS',
  'INVESTMENTS',
]);
export type AccountGroupEnum = z.infer<typeof AccountGroupEnum>;

export const createAccountFormSchema = z.object({
  name: z.coerce
    .string()
    .min(3, { message: 'Must be 3 or more characters long' })
    .max(48, { message: 'Must be 48 or fewer characters long' }),
  group: AccountGroupEnum,
  balance: z.coerce.number().nonnegative(),
  paymentAccountId: z.optional(z.coerce.number()),
  description: z.optional(
    z.string().max(148, { message: 'Must be 148 or fewer characters long' }),
  ),
});

export type CreateAccountForm = z.infer<typeof createAccountFormSchema>;

export type QueryKey = 'asset' | 'debt' | 'total';
