import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'

import prisma from '@/lib/prisma/singleton'

import { authOptions } from '../auth/[...nextauth]'

type Req = {
  query: {
    update: string
  }
} & NextApiRequest

export default async function updateStampHandler(
  req: Req,
  res: NextApiResponse
) {
  const { update: stampId } = req.query
  const session = await getServerSession(req, res, authOptions)

  if (!session?.user.id) {
    return res.status(401).json({ message: 'Unauthorized.' })
  }

  if (req.method !== 'PUT') {
    return res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` })
  }

  console.log(req.body)
  try {
    // await prisma.stamp.update({
    //   where: {
    //     id: getStamp.id,
    //   },
    //   data: {},
    // })

    return res.status(200).json({ message: 'successfully updated' })
  } catch (e) {
    return res.status(500).json({ message: 'something went wrong' })
  }
}
