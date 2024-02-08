import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const stampsPerPage = () => {
  return Number(process.env.NEXT_PUBLIC_STAMPS_PER_PAGE) || 20
}
