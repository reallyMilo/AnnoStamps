//TODO: Local stack or aws sandbox removes this

import { createId } from '@paralleldrive/cuid2'
import { outputFileSync } from 'fs-extra'
import { NextApiRequest, NextApiResponse } from 'next'
import sharp from 'sharp'

import { auth } from '@/auth'

const BREAKPOINTS = {
  large: 1024,
  medium: 768,
  small: 640,
  thumbnail: 250,
} as const

type Breakpoint = keyof typeof BREAKPOINTS

const breakpointKeys = Object.keys(BREAKPOINTS) as Breakpoint[]

const generateResponsiveImages = async (filepath: string, filename: string) => {
  const { width, height } = await sharp(filepath).metadata()
  if (!width || !height) {
    return
  }
  for (const key of breakpointKeys) {
    const breakpoint = BREAKPOINTS[key]

    if (breakpoint < width || breakpoint < height) {
      const folderPath = filepath.slice(0, -filename.length)
      const outputPath = `${folderPath}${key}_${filename.split('.')[0]}.webp`

      await sharp(filepath)
        .resize(breakpoint, breakpoint, {
          fit: 'inside',
        })
        .sharpen()
        .toFormat('webp', { quality: 100 })
        .toFile(outputPath)
    }
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb',
    },
  },
}

interface Req extends NextApiRequest {
  query: { fileType: string; filename: string; stampId: string }
}
type Response = {
  message: string
  ok: boolean
  path?: string
}
export default async function localHandler(
  req: Req,
  res: NextApiResponse<Response>
) {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(500).json({ ok: false, message: 'only in dev mode' })
  }
  const session = await auth(req, res)

  if (!session?.user?.id) {
    return res.status(401).json({ ok: false, message: 'Unauthorized.' })
  }

  const { filename, fileType, stampId } = req.query

  const base64Image = req.body.split('base64,')?.[1]
  const buffer = Buffer.from(base64Image, 'base64')
  const name = fileType === 'zip' ? createId() + '.zip' : createId() + filename
  const filepath = `public/tmp/${stampId}/${name}`
  outputFileSync(filepath, buffer)
  if (fileType !== 'zip') {
    await generateResponsiveImages(filepath, name)
  }
  return res.status(200).json({
    ok: true,
    message: 'asset uploaded',
    path: `/tmp/${stampId}/${name}`,
  })
}
