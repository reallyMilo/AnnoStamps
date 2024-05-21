import { ClassValue, clsx } from 'clsx'
import { formatDistanceToNowStrict, fromUnixTime } from 'date-fns'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const distanceUnixTimeToNow = (unixTimestamp: number) => {
  return formatDistanceToNowStrict(fromUnixTime(unixTimestamp), {
    addSuffix: true,
  })
}
