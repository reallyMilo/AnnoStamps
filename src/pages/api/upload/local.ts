//TODO: Local stack or aws sandbox removes this

import { createId } from '@paralleldrive/cuid2'
import { outputFileSync } from 'fs-extra'
import { NextApiRequest, NextApiResponse } from 'next'

import { generateResponsiveImages } from '@/lib/upload/image-manipulation'

interface Req extends NextApiRequest {
  query: { fileType: string; filename: string; stampId: string }
}
export default async function localHandler(req: Req, res: NextApiResponse) {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(500).json('only on local')
  }

  const { filename, fileType, stampId } = req.query

  const base64Image = req.body.split('base64,')?.[1]
  const buffer = Buffer.from(base64Image, 'base64')
  const name = fileType === 'zip' ? createId() + '.zip' : filename
  const filepath = `public/tmp/${stampId}/${name}`
  outputFileSync(filepath, buffer)
  if (fileType !== 'zip') {
    await generateResponsiveImages(filepath, name)
  }
  return res.status(200).json(name)
}
