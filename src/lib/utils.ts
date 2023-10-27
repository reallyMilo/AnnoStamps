import { Prisma } from '@prisma/client'
import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import { FilterState } from './hooks/useFilter'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const stampsPerPage = () => {
  return Number(process.env.NEXT_PUBLIC_STAMPS_PER_PAGE) || 20
}

export const fetcher = async (url: string) => {
  const res = await fetch(url)

  if (!res.ok) {
    const error = new Error(
      'An error occurred while fetching the data.'
    ) as Error & { info: string; status: number }
    error.info = await res.json()
    error.status = res.status
    throw error
  }

  return res.json()
}

export async function sendRequest(
  url: string,
  {
    arg,
  }: {
    arg: any
  }
) {
  return fetch(url, {
    method: 'POST',
    body: arg,
  }).then((res) => res.json())
}

export const displayAuthModal = () => {
  window.dispatchEvent(new Event('open-auth-modal'))
}

export const parseBoolean = (value?: string) => value === 'true'

//TODO: clean up by move to model filters
export const buildFilterWhereClause = (
  filter: Omit<FilterState, 'sort' | 'page'>
) => {
  const { modded, capital, region, category, townhall, tradeUnion, search } =
    filter
  return Prisma.validator<Prisma.StampWhereInput>()({
    ...(modded ? { modded: parseBoolean(modded) } : {}),
    ...(region ? { region } : {}),
    ...(category ? { category } : {}),
    ...(capital ? { capital } : {}),
    ...(parseBoolean(townhall) ? { townhall: true } : {}),
    ...(parseBoolean(tradeUnion) ? { tradeUnion: true } : {}),
    ...(search
      ? {
          title: {
            search,
          },
        }
      : {}),
  })
}
export const buildOrderByClause = (orderBy?: FilterState['sort']) => {
  switch (orderBy) {
    case 'newest':
      return { createdAt: 'desc' as const }
    default:
      return { downloads: 'desc' as const }
  }
}
