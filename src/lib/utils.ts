import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFullMonthAndDate(
  date: Date,
  monthFormat: 'short' | 'long',
): string {
  return date.toLocaleDateString('en-CA', {
    month: monthFormat,
    year: 'numeric',
  });
}

export const getInitials = (name: string): string => {
  if (!name) {
    return '';
  }
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase();
};

export function capitalize(input: string): string {
  if (!input) return '';
  return input.charAt(0).toUpperCase() + input.slice(1);
}

export const formattedAmount = (amount: number): string => {
  return amount.toLocaleString('en-CA', {
    style: 'currency',
    currency: 'CAD',
  });
};

export const cleanString = (str: string): string => {
  return str.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
};

export const getFormattedDateTime = (dateTime: Date): string => {
  const date = new Date(dateTime);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return formattedDate;
};
