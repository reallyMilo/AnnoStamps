import { createHmac } from 'node:crypto'

import { NextApiRequest, NextApiResponse } from 'next'

import prisma from '@/lib/prisma/singleton'

interface Req extends NextApiRequest {
  body: {
    [key: string]: string
    id: string
  }
}
export default async function webhookHandler(req: Req, res: NextApiResponse) {
  if (!req.headers.signature || typeof req.headers.signature !== 'string') {
    return res.status(401).json({ message: 'no signature' })
  }

  const sig = req.headers.signature

  const digest = createHmac('sha256', process.env.WEBHOOK_SECRET as string)
    .update(JSON.stringify(req.body))
    .digest('hex')

  if (digest !== sig) {
    return res.status(401).send({
      message: `No signature match`,
    })
  }

  const { id, ...url } = req.body

  //TODO: lambda cannot be invoked before the stamp is created with original image
  setTimeout(async () => {
    try {
      await prisma.image.update({
        where: { id },
        data: url,
      })
      return res.status(200).json({ message: 'updated image' })
    } catch (e) {
      return res.status(500).json({ message: e })
    }
    // vercel will timeout at 10 seconds
  }, 7000)
}
