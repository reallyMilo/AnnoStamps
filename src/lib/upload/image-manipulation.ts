import formidable from 'formidable'
import sharp from 'sharp'

const BREAKPOINTS = {
  large: 1000,
  medium: 750,
  small: 500,
  thumbnail: 250,
} as const

type Breakpoint = keyof typeof BREAKPOINTS

const breakpointKeys = Object.keys(BREAKPOINTS) as Breakpoint[]

const getMetadata = async (filepath: string) => {
  return await sharp(filepath).metadata()
}

const generateImage = async (
  file: formidable.File,
  breakpoint: number,
  key: Breakpoint
) => {
  const directory = 'public'
  const outputPath = `/tmp/${key}_${file.newFilename.split('.').shift()}.webp`

  await sharp(file.filepath)
    .resize(breakpoint, breakpoint, {
      fit: 'inside',
    })
    .toFile(directory + outputPath)

  const appendUrl = key + 'Url'
  return { [appendUrl]: outputPath }
}

const breakpointSmaller = (breakpoint: number, width = 0, height = 0) => {
  return breakpoint < width || breakpoint < height
}

export const generateResponsiveImages = async (file: formidable.File) => {
  const { width, height } = await getMetadata(file.filepath)

  const result = Promise.all(
    breakpointKeys.map((key) => {
      const breakpoint = BREAKPOINTS[key]

      if (breakpointSmaller(breakpoint, width, height)) {
        return generateImage(file, breakpoint, key)
      }
      return undefined
    })
  )

  return (await result).reduce((result, currentObj) => {
    return { ...result, ...currentObj }
  }, {})
}
