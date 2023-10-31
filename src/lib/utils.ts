import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

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
