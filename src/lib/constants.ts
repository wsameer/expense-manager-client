export const USER_KEY = 'sameer.expense-manager.user';
export const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}`;

const AUTH = 'auth/';

export const REGISTRATION_API = AUTH + 'register';
export const LOGIN_API = AUTH + 'login';
export const LOGOUT_API = AUTH + 'logout';
export const GET_USER_API = AUTH + 'me';

export const CAD = new Intl.NumberFormat('en-CA', {
  style: 'currency',
  currency: 'CAD',
});
