import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'

import prisma from '@/lib/prisma/singleton'

import { authOptions } from '../../auth/[...nextauth]'

export default async function likesHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)
  const { stamp: stampId } = req.query

  if (!session) {
    return res.status(401).json({ ok: false, message: 'Unauthorized.' })
  }

  if (req.method !== 'PUT') {
    res.setHeader('Allow', ['PUT'])
    return res.status(405).json({
      ok: false,
      message: `HTTP method ${req.method} is not supported.`,
    })
  }

  try {
    const updateStampLikes = await prisma.stamp.update({
      where: { id: stampId as string },
      include: { likedBy: true },
      data: {
        likedBy: {
          connect: { id: session.user.id },
        },
      },
    })

    res.status(200).json({
      ok: true,
      stamp: updateStampLikes,
      message: 'stamp successfully liked',
    })
  } catch (e) {
    res.status(500).json({ ok: false, message: e })
  }
}
