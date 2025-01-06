import { USER_KEY } from '@/lib/constants';
import { User } from '@/types';
import React, { useState, useEffect, ReactNode } from 'react';
import { AuthContext } from './auth-context';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for stored user data on component mount
    const storedUser = localStorage.getItem(USER_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    // Update localStorage and authentication state when user changes
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem(USER_KEY);
      setIsAuthenticated(false);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
