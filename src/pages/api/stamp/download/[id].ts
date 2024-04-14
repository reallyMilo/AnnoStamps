import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '@/lib/prisma/singleton'

interface Req extends NextApiRequest {
  query: {
    id: string
  }
}
export default async function downloadHandler(req: Req, res: NextApiResponse) {
  const { id } = req.query
  try {
    await prisma.stamp.update({
      where: { id },
      data: {
        downloads: { increment: 1 },
      },
    })

    return res.status(200).json({ message: 'success' })
  } catch (e) {
    return res.status(500).json({ message: e })
  }
}
