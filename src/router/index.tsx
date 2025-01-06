import { useMemo } from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { APP_ROUTE, BASE_ROUTE, DASHBOARD_ROUTE, LOGIN_ROUTE, REGISTER_ROUTE, TRANSACTIONS_ROUTE } from "./routes";
import { ProtectedRoute } from "@/lib/protected-route";
import { AppRoot } from "@/pages/root";

const createRouter = () => createBrowserRouter([
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
        path: DASHBOARD_ROUTE,
        lazy: async () => {
          const { DashboardRoute } = await import('../pages/dashboard');
          return { Component: DashboardRoute };
        },
      },
    ]
  },
  {
    path: '*',
    lazy: async () => {
      const { NotFoundRoute } = await import('../pages/not-found');
      return { Component: NotFoundRoute };
    },
  },
])

export const AppRouter = () => {
  const router = useMemo(() => createRouter(), []);
  return <RouterProvider router={router} />
}