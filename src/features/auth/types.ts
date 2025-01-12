import { User } from '@/types';

export interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAuthenticated: boolean;
}

export type LoginResponse = {
  success: boolean;
  data?: {
    name: string;
    email: string;
    token: string;
  };
  message?: string;
};

export type LogoutResponse = {
  success: boolean;
  message?: string;
};
