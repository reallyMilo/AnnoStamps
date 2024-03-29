import * as Sentry from '@sentry/nextjs'
import type { NextApiRequest, NextApiResponse } from 'next'
import stream, { Readable } from 'stream'
import { promisify } from 'util'

import prisma from '@/lib/prisma/singleton'
const pipeline = promisify(stream.pipeline)

export default async function downloadHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { stamp, file, title } = req.query

  const fileRes = await fetch(file as string)

  try {
    await prisma.stamp.update({
      where: { id: stamp as string },
      data: {
        downloads: { increment: 1 },
      },
    })
  } catch (e) {
    Sentry.captureException(e)
  }

  res.setHeader('Content-Type', 'application/zip')
  res.setHeader('Content-Disposition', `attachment; filename=${title}.zip`)
  res.status(200)
  //@ts-expect-error no type
  await pipeline(Readable.fromWeb(fileRes.body), res)
}
