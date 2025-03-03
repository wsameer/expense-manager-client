import { useMemo } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import {
  ACCOUNT_SETTINGS_ROUTE,
  ACCOUNTS_ROUTE,
  APP_ROUTE,
  BASE_ROUTE,
  DASHBOARD_ROUTE,
  DATA_SETTINGS_ROUTE,
  EXPENSE_CATEGORY_SETTINGS_ROUTE,
  INCOME_CATEGORY_SETTINGS_ROUTE,
  LOGIN_ROUTE,
  REGISTER_ROUTE,
  SETTINGS_ROUTE,
  TRANSACTIONS_ROUTE,
} from './routes';
import { ProtectedRoute } from '@/lib/protected-route';
import { AppRoot } from '@/pages/root';

const createRouter = () =>
  createBrowserRouter([
    {
      path: BASE_ROUTE,
      lazy: async () => {
        const { Welcome } = await import('../pages/welcome');
        return { Component: Welcome };
      },
    },
    {
      path: REGISTER_ROUTE,
      lazy: async () => {
        const { RegisterRoute } = await import('../pages/auth/register');
        return { Component: RegisterRoute };
      },
    },
    {
      path: LOGIN_ROUTE,
      lazy: async () => {
        const { LoginRoute } = await import('../pages/auth/login');
        return { Component: LoginRoute };
      },
    },
    {
      path: APP_ROUTE,
      element: (
        <ProtectedRoute>
          <AppRoot />
        </ProtectedRoute>
      ),
      children: [
        {
          path: TRANSACTIONS_ROUTE,
          lazy: async () => {
            const { TransactionsRoute } = await import('../pages/transactions');
            return { Component: TransactionsRoute };
          },
        },
        {
          path: ACCOUNTS_ROUTE,
          lazy: async () => {
            const { AccountsRoute } = await import(
              '../pages/accounts/accounts'
            );
            return { Component: AccountsRoute };
          },
        },
        {
          path: `${ACCOUNTS_ROUTE}/:id`,
          lazy: async () => {
            const { AccountDetailsRoute } = await import(
              '../pages/accounts/account'
            );
            return { Component: AccountDetailsRoute };
          },
        },
        {
          path: SETTINGS_ROUTE,
          lazy: async () => {
            const { SettingsRoute } = await import(
              '../pages/settings/settings'
            );
            return { Component: SettingsRoute };
          },
        },
        {
          path: EXPENSE_CATEGORY_SETTINGS_ROUTE,
          lazy: async () => {
            const { ExpenseCategoryRoute } = await import(
              '../pages/settings/expense-category'
            );
            return { Component: ExpenseCategoryRoute };
          },
        },
        {
          path: INCOME_CATEGORY_SETTINGS_ROUTE,
          lazy: async () => {
            const { IncomeCategoriesSettings } = await import(
              '../features/settings/income-categories'
            );
            return { Component: IncomeCategoriesSettings };
          },
        },
        {
          path: ACCOUNT_SETTINGS_ROUTE,
          lazy: async () => {
            const { AccountSettingsRoute } = await import(
              '../pages/settings/account-settings'
            );
            return { Component: AccountSettingsRoute };
          },
        },
        {
          path: DATA_SETTINGS_ROUTE,
          lazy: async () => {
            const { DataSettingsRoute } = await import(
              '../pages/settings/data-settings'
            );
            return { Component: DataSettingsRoute };
          },
        },
        {
          path: DASHBOARD_ROUTE,
          lazy: async () => {
            const { DashboardRoute } = await import('../pages/dashboard');
            return { Component: DashboardRoute };
          },
        },
      ],
    },
    {
      path: '*',
      lazy: async () => {
        const { NotFoundRoute } = await import('../pages/not-found');
        return { Component: NotFoundRoute };
      },
    },
  ]);

export const AppRouter = () => {
  const router = useMemo(() => createRouter(), []);
  return <RouterProvider router={router} />;
};
