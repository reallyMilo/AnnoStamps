import { formatDistanceToNowStrict, fromUnixTime } from 'date-fns'

export const distanceUnixTimeToNow = (unixTimestamp: number) => {
  return formatDistanceToNowStrict(fromUnixTime(unixTimestamp), {
    addSuffix: true,
  })
}
export const formatIntegerWithSuffix = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  }
  if (num >= 100000) {
    return Math.floor(num / 1000) + 'K'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  }
  return num.toString()
}
