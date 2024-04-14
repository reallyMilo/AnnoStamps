import type { NextApiRequest, NextApiResponse } from 'next'

import { auth } from '@/auth'
import { StampWithRelations } from '@/lib/prisma/queries'
import prisma from '@/lib/prisma/singleton'

interface Req extends NextApiRequest {
  query: {
    id: string
  }
}
export default async function likesHandler(
  req: Req,
  res: NextApiResponse<{
    message: string | unknown
    ok: boolean
    stamp?: Pick<StampWithRelations, 'likedBy'>
  }>
) {
  if (req.method !== 'PUT') {
    return res.status(405).json({
      ok: false,
      message: `HTTP method ${req.method} is not supported.`,
    })
  }
  const session = await auth(req, res)
  const { id } = req.query

  if (!session) {
    return res.status(401).json({ ok: false, message: 'Unauthorized.' })
  }

  try {
    const updateStampLikes = await prisma.stamp.update({
      where: { id },
      include: { likedBy: true },
      data: {
        likedBy: {
          connect: { id: session.user.id },
        },
      },
    })

    return res.status(200).json({
      ok: true,
      stamp: updateStampLikes,
      message: 'stamp successfully liked',
    })
  } catch (e) {
    return res.status(500).json({ ok: false, message: e })
  }
}
