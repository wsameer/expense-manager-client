import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getFullMonthAndDate (date: Date): string {
  return date.toLocaleDateString('en-CA', { month: 'long', year: 'numeric' });
};