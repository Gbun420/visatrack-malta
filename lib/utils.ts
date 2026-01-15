import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getVisaStatusColor(expiryDate: string) {
  const days = Math.ceil((new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  if (days < 0) return 'red';
  if (days <= 90) return 'yellow';
  return 'green';
}
