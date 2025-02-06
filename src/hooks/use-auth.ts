import { AuthContext } from '@/features/auth/auth-context';
import { useContext } from 'react';
import { toast } from './use-toast';
import axiosInstance from '@/lib/api-client';
import {
  GET_USER_API,
  LOGIN_API,
  LOGOUT_API,
  REGISTRATION_API,
} from '@/lib/constants';
import { LoginResponse } from '@/features/auth/types';
import { User } from '@/types';
import { AxiosError, AxiosResponse, isAxiosError } from 'axios';

const REGISTRATION_ERROR_MESSAGE =
  'Unexpected error during registration. Please try again';

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { user, setUser, isAuthenticated } = context;

  function showErrorToast(
    title = 'Uh oh! Something went wrong.',
    description = 'There was a problem with your request.',
  ) {
    toast({
      variant: 'destructive',
      title,
      description,
    });
  }

  const loginUser = async (
    email: string,
    password: string,
  ): Promise<boolean> => {
    try {
      const response: AxiosResponse<LoginResponse> = await axiosInstance.post(
        LOGIN_API,
        {
          email,
          password,
        },
      );

      if (response.data.success && response.data.data) {
        const { name, email } = response.data.data;
        setUser({ name, email });
        return true;
      } else {
        showErrorToast('There was a problem with your request.');
        return false;
      }
    } catch (error) {
      // Handle different types of errors
      if (error instanceof AxiosError) {
        showErrorToast(undefined, error?.response?.data.errors[0].message);
      } else {
        // Handle unexpected errors
        showErrorToast(
          'Uh oh! Something went wrong.',
          'Unexpected error during login',
        );
      }
      return false;
    }
  };

  const registerUser = async (
    name: string,
    email: string,
    password: string,
  ): Promise<boolean> => {
    try {
      const { data } = await axiosInstance.post<LoginResponse>(
        REGISTRATION_API,
        {
          name,
          email,
          password,
          password_confirmation: password,
        },
      );

      if (data.success) {
        return true;
      } else {
        showErrorToast('Registration failed', 'Please try again.');
        return false;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (isAxiosError(error)) {
        showErrorToast(error.name, error.message);
        return false;
      }
      const { data } = error.response;
      showErrorToast(data.message, data.data[0] || REGISTRATION_ERROR_MESSAGE);
      return false;
    }
  };

  const logoutUser = async () => {
    const { data } = await axiosInstance.delete(LOGOUT_API);
    if (data.success) {
      setUser(null);
      toast({
        variant: 'default',
        description: 'Logout successful',
      });
      return true;
    } else {
      showErrorToast(
        'Uh oh! Something went wrong.',
        'Unexpected error during logout. Please try again',
      );
      return false;
    }
  };

  const fetchCurrentUser = async () => {
    const response = await axiosInstance.get<User>(GET_USER_API);
    setUser(response.data);
  };

  return {
    user,
    isAuthenticated,
    login: loginUser,
    register: registerUser,
    logout: logoutUser,
    fetchCurrentUser,
  };
};
