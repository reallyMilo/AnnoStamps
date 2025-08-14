import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    description: 'A community site for uploading and sharing stamps for Anno',
    icons: [
      {
        sizes: '16x16',
        src: '/favicon.ico',
        type: 'image/x-icon',
      },
    ],
    name: 'AnnoStamps',
    short_name: 'AnnoStamps',
    start_url: '/',
  }
}
