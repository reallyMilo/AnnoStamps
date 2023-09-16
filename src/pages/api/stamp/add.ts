import formidable from 'formidable'

import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'

import prisma from '@/lib/prisma/singleton'

import { authOptions } from '../auth/[...nextauth]'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function addStampHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)

  if (!session || !session?.user?.id) {
    return res.status(401).json({ message: 'Unauthorized.' })
  }

  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` })
  }

  const form = formidable({
    multiples: true,
    keepExtensions: true,
    maxFiles: 20,
    maxFileSize: 1024 * 1024, // 1 MB
    uploadDir: 'public/tmp/',
  })

  try {
    const [fields, files] = await form.parse(req)

    return res.status(200).json({ message: 'stamps uploaded to public/tmp' })
  } catch (e) {
    return res.status(500).json({ e })
  }
}
