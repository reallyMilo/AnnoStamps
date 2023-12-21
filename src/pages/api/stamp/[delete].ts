import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'

import prisma from '@/lib/prisma/singleton'

import { authOptions } from '../auth/[...nextauth]'

type Response = {
  message: string | unknown
  ok: boolean
}

interface Req extends NextApiRequest {
  query: {
    delete: string
  }
}

export default async function deleteStampHandler(
  req: Req,
  res: NextApiResponse<Response>
) {
  const session = await getServerSession(req, res, authOptions)

  const { delete: stampId } = req.query

  if (!session?.user?.id) {
    return res.status(401).json({ ok: false, message: 'Unauthorized.' })
  }

  if (req.method !== 'DELETE') {
    return res.status(405).json({
      ok: false,
      message: `HTTP method ${req.method} is not supported.`,
    })
  }

  try {
    const userStamp = await prisma.user.findUnique({
      select: {
        listedStamps: {
          where: {
            id: stampId,
          },
        },
      },
      where: {
        id: session.user.id,
      },
    })

    if (userStamp?.listedStamps.length === 0) {
      return res.status(404).json({ ok: false, message: 'not found' })
    }

    const deleteImages = prisma.image.deleteMany({
      where: {
        stampId,
      },
    })

    const deleteStamp = prisma.stamp.delete({
      where: {
        id: stampId,
      },
    })

    const [, removedStamp] = await prisma.$transaction([
      deleteImages,
      deleteStamp,
    ])

    return res
      .status(200)
      .json({ ok: true, message: removedStamp.title + 'has been removed' })
  } catch (e) {
    return res.status(500).json({ ok: false, message: e })
  }
}
