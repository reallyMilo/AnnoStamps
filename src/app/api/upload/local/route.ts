import { createId } from '@paralleldrive/cuid2'
import { outputFileSync } from 'fs-extra'
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
  const { height, width } = await sharp(filepath).metadata()
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

export const POST = auth(async (req) => {
  if (process.env.NODE_ENV !== 'development') {
    return Response.json(
      { message: 'only in dev mode', ok: false },
      { status: 500 },
    )
  }

  if (!req.auth) {
    return Response.json(
      { message: 'Unauthorized.', ok: false },
      { status: 401 },
    )
  }
  const searchParams = req.nextUrl.searchParams
  const stampId = searchParams.get('stampId')
  const filename = searchParams.get('filename')
  const fileType = searchParams.get('fileType')

  const arrayBuffer = await req.arrayBuffer()

  const name = fileType === 'zip' ? createId() + '.zip' : filename
  const filepath = `public/tmp/${stampId}/${name}`
  outputFileSync(filepath, Buffer.from(arrayBuffer))
  if (fileType !== 'zip') {
    await generateResponsiveImages(filepath, name ?? 'nofilename')
  }
  return Response.json({
    message: 'asset uploaded',
    ok: true,
    path: `/tmp/${stampId}/${name}`,
  })
})
