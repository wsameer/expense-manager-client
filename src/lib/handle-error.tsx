import { AxiosError } from 'axios';

interface FetchError {
  message: string;
  statusCode?: number;
}

export const handleError = (error: unknown): FetchError => {
  const fetchError: FetchError = {
    message: 'An unexpected error occurred',
  };

  if (error instanceof AxiosError) {
    fetchError.statusCode = error.response?.status;
    fetchError.message = error.response?.data?.message || error.message;

    if (error.response?.status === 400) {
      fetchError.message = 'Invalid account data';
    } else if (error.response?.status >= 500) {
      fetchError.message = 'Server error. Please try again later.';
    }
  } else if (error instanceof Error) {
    fetchError.message = error.message;
  }

  return fetchError;
};
