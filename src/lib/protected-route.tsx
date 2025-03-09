import { useAuth } from '@/hooks';
import { Navigate, useLocation } from 'react-router-dom';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (user) {
    return children;
  }

  return (
    <Navigate
      to={`/auth/login?redirectTo=${encodeURIComponent(location.pathname)}`}
      replace
    />
  );
};
