import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { CreateStamp } from 'types'
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const pageSize = () => {
  return Number(process.env.NEXT_PUBLIC_PAGE_SIZE) || 20
}

export function validateRegion(
  region: string
): region is CreateStamp['category'] {
  return Object.values(Category).includes(region as Category)
}
