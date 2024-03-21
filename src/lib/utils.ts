import { ClassValue, clsx } from 'clsx'
import { formatDistanceToNowStrict, fromUnixTime } from 'date-fns'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const stampsPerPage =
  Number(process.env.NEXT_PUBLIC_STAMPS_PER_PAGE) || 20

export const distanceUnixTimeToNow = (unixTimestamp: number) => {
  return formatDistanceToNowStrict(fromUnixTime(unixTimestamp), {
    addSuffix: true,
  })
}
