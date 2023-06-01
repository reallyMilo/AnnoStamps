import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const pageSize = () => {
  return Number(process.env.NEXT_PUBLIC_PAGE_SIZE) || 20
}
