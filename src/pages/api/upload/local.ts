//TODO: Local stack or aws sandbox removes this

import { writeFileSync } from 'fs'
import { nanoid } from 'nanoid'
import { NextApiRequest, NextApiResponse } from 'next'

interface Req extends NextApiRequest {
  query: { fileType: string; filename: string }
}
export default async function localHandler(req: Req, res: NextApiResponse) {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(500).json('only on local')
  }

  const { filename, fileType } = req.query

  const base64Image = req.body.split('base64,')?.[1]
  const buffer = Buffer.from(base64Image, 'base64')
  const name = fileType === 'zip' ? nanoid(16) + '.zip' : filename
  writeFileSync(`public/tmp/${name}`, buffer)
  //generate responsive if image
  return res.status(200).json(name)
}
