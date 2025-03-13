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
  USER_PROFILE_ROUTE,
} from './routes';
import { ProtectedRoute } from '@/lib/protected-route';
import { AppRoot } from '@/pages/root';

const createRouter = () =>
  createBrowserRouter([
    {
      path: BASE_ROUTE,
      lazy: async () => {
        const { Welcome } = await import('../../pages/welcome');
        return { Component: Welcome };
      },
    },
    {
      path: REGISTER_ROUTE,
      lazy: async () => {
        const { RegisterRoute } = await import('../../pages/auth/register');
        return { Component: RegisterRoute };
      },
    },
    {
      path: LOGIN_ROUTE,
      lazy: async () => {
        const { LoginRoute } = await import('../../pages/auth/login');
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
            const { TransactionsPage } = await import(
              '../../pages/transactions'
            );
            return { Component: TransactionsPage };
          },
        },
        {
          path: ACCOUNTS_ROUTE,
          lazy: async () => {
            const { AccountsPage } = await import('../../pages/accounts');
            return { Component: AccountsPage };
          },
        },
        {
          path: `${ACCOUNTS_ROUTE}/:id`,
          lazy: async () => {
            const { AccountDetailsPage } = await import('../../pages/accounts');
            return { Component: AccountDetailsPage };
          },
        },
        {
          path: SETTINGS_ROUTE,
          lazy: async () => {
            const { SettingsPage } = await import('../../pages/settings');
            return { Component: SettingsPage };
          },
        },
        {
          path: USER_PROFILE_ROUTE,
          lazy: async () => {
            const { UserProfilePage } = await import(
              '../../pages/settings/profile'
            );
            return { Component: UserProfilePage };
          },
        },
        {
          path: EXPENSE_CATEGORY_SETTINGS_ROUTE,
          lazy: async () => {
            const { ExpenseCategoriesSettingsPage } = await import(
              '../../pages/settings/expense-categories'
            );
            return { Component: ExpenseCategoriesSettingsPage };
          },
        },
        {
          path: INCOME_CATEGORY_SETTINGS_ROUTE,
          lazy: async () => {
            const { IncomeCategoriesSettingsPage } = await import(
              '../../pages/settings/income-categories'
            );
            return { Component: IncomeCategoriesSettingsPage };
          },
        },
        {
          path: ACCOUNT_SETTINGS_ROUTE,
          lazy: async () => {
            const { AccountSettingsPage } = await import(
              '../../pages/settings/accounts'
            );
            return { Component: AccountSettingsPage };
          },
        },
        {
          path: DATA_SETTINGS_ROUTE,
          lazy: async () => {
            const { DataSettingsPage } = await import(
              '../../pages/settings/data-setting'
            );
            return { Component: DataSettingsPage };
          },
        },
        {
          path: DASHBOARD_ROUTE,
          lazy: async () => {
            const { DashboardPage } = await import('../../pages/dashboard');
            return { Component: DashboardPage };
          },
        },
      ],
    },
    {
      path: '*',
      lazy: async () => {
        const { NotFoundRoute } = await import('../../pages/not-found');
        return { Component: NotFoundRoute };
      },
    },
  ]);

export const AppRouter = () => {
  const router = useMemo(() => createRouter(), []);
  return <RouterProvider router={router} />;
};
