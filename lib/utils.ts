import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const pageSize = () => {
  return Number(process.env.NEXT_PUBLIC_PAGE_SIZE) || 20
}

export const fetcher = (url: string) => fetch(url).then((r) => r.json())

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
    body: JSON.stringify(arg),
  }).then((res) => res.json())
}

export function triggerDownload(data: Blob, filename: string) {
  const blobUrl =
    window.URL && window.URL.createObjectURL
      ? window.URL.createObjectURL(data)
      : window.webkitURL.createObjectURL(data)
  const tempLink = document.createElement('a')
  tempLink.style.display = 'none'
  tempLink.href = blobUrl
  tempLink.setAttribute('download', filename)

  document.body.appendChild(tempLink)
  tempLink.click()

  setTimeout(function () {
    document.body.removeChild(tempLink)
    window.URL.revokeObjectURL(blobUrl)
  }, 200)
}

export function displayAuthModal() {
  window.dispatchEvent(new Event('open-auth-modal'))
}
