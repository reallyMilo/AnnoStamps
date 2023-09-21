import { Prisma } from '@prisma/client'
import { ClassValue, clsx } from 'clsx'
import formidable from 'formidable'
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

export const triggerDownload = (data: Blob, filename: string) => {
  const blobUrl =
    window.URL && window.URL.createObjectURL
      ? window.URL.createObjectURL(data)
      : window.webkitURL.createObjectURL(data)
  const tempLink = document.createElement('a')
  tempLink.style.display = 'none'
  tempLink.href = blobUrl
  tempLink.setAttribute('download', filename)

  tempLink.type = 'application/octet-stream'

  document.body.appendChild(tempLink)
  tempLink.click()

  setTimeout(() => {
    document.body.removeChild(tempLink)
    window.URL.revokeObjectURL(blobUrl)
  }, 200)
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

export const rawFileToAsset = (rawFile: File) => {
  return {
    size: rawFile.size / 1000,
    createdAt: new Date(rawFile.lastModified).toISOString(),
    name: rawFile.name,
    url: URL.createObjectURL(rawFile),
    ext: rawFile.name.split('.').pop(),
    mime: rawFile.type,
    rawFile,
  }
}

export const firstValues = (fields: formidable.Fields) => {
  return Object.fromEntries(
    Object.entries(fields).map(([key, value]) => {
      if (!value) {
        return [key, undefined]
      }
      return [key, value[0]]
    })
  )
}
