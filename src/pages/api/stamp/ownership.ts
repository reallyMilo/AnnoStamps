import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'

import prisma from '@/lib/prisma/singleton'

import { authOptions } from '../auth/[...nextauth]'

interface Req extends NextApiRequest {
  query: { id: string }
}
export default async function ownershipHandler(req: Req, res: NextApiResponse) {
  const { id } = req.query
  console.log(id)
  const session = await getServerSession(req, res, authOptions)

  if (!session?.user.id) {
    return res.status(401).json({ message: 'Unauthorized.' })
  }

  const getStamp = await prisma.stamp.findUnique({
    where: {
      id,
    },
    include: {
      images: true,
    },
  })

  if (getStamp?.userId !== session.user.id) {
    return res.status(401).json({ message: 'Not stamp author' })
  }

  return res.status(200).json(getStamp)
}
