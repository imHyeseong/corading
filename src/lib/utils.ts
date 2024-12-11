// -------------- shadcn ----------------
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
export const sleep = (ms: number) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

export const truncateDecimal = (value: number, decimal: number) => {
	return Math.trunc(value * 10 ** decimal) / 10 ** decimal;
};
