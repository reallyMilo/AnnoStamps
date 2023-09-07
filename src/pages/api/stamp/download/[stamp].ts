import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from '@/lib/prisma/singleton'

export default async function downloadHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { stamp } = req.query
  try {
    await prisma.stamp.update({
      where: { id: stamp as string },
      data: {
        downloads: { increment: 1 },
      },
    })

    res.status(200).json({ message: 'success' })
  } catch (e) {
    res.status(500).json({ message: e })
  }
}
