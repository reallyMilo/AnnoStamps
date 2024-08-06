import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AnnoStamps',
    short_name: 'AnnoStamps',
    description:
      'A community site for uploading and sharing stamps for Anno 1800',
    start_url: '/',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '16x16',
        type: 'image/x-icon',
      },
    ],
  }
}
