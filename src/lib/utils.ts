import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
// https://github.com/vercel/next.js/issues/54156
// https://github.com/vercel/next.js/pull/67211 fixed in next 15
export type ServerAction<T, U> = ((data: T) => Promise<U>) & Function //eslint-disable-line
