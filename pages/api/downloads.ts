import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from '@/lib/prisma'

export default async function downloadsHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //FIXME: shouldnt be post, should be [download] dynamic api route
  if (req.method === 'POST') {
    try {
      const stampId = JSON.parse(req.body)

      await prisma.stamp.update({
        where: { id: stampId },
        data: {
          downloads: { increment: 1 },
        },
      })

      res.status(200).json({ message: 'success' })
    } catch (e) {
      res.status(500).json({ message: e })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` })
  }
}
