import type { NextApiRequest, NextApiResponse } from 'next'

import { auth } from '@/auth'
import prisma from '@/lib/prisma/singleton'

type Response = {
  message: string | unknown
  ok: boolean
}

interface Req extends NextApiRequest {
  query: {
    id: string
  }
}

export default async function deleteStampHandler(
  req: Req,
  res: NextApiResponse<Response>
) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({
      ok: false,
      message: `HTTP method ${req.method} is not supported.`,
    })
  }

  const session = await auth(req, res)

  const { id: stampId } = req.query

  if (!session?.user?.id) {
    return res.status(401).json({ ok: false, message: 'Unauthorized.' })
  }
  if (!session.user.usernameURL) {
    return res.status(400).json({ ok: false, message: 'UsernameURL not set' })
  }

  try {
    const removeStamp = await prisma.$transaction(async (tx) => {
      const userStamp = await tx.user.findUnique({
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
        throw new Error('Not stamp owner')
      }

      await tx.image.deleteMany({
        where: {
          stampId,
        },
      })

      return await tx.stamp.delete({
        where: {
          id: stampId,
        },
      })
    })
    res.revalidate(`/${session.user.usernameURL}`)
    return res
      .status(200)
      .json({ ok: true, message: removeStamp.title + 'has been removed' })
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).json({ ok: false, message: e.message })
    }

    return res.status(500).json({ ok: false, message: e })
  }
}
