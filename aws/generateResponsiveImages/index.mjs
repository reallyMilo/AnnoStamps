import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import sharp from 'sharp'
import { Readable } from 'stream'
import util from 'util'

const s3 = new S3Client({ region: 'eu-central-1' })

export const handler = async (event) => {
  console.log(
    'Reading options from event:\n',
    util.inspect(event, { depth: 5 }),
  )
  const srcBucket = event.Records[0].s3.bucket.name

  const srcKey = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, ' '),
  )
  const dstBucket = srcBucket
  const startIdx = srcKey.lastIndexOf('/')
  const lastIndex = srcKey.lastIndexOf('.')
  const [path, filename] = [
    srcKey.slice(0, startIdx),
    srcKey.slice(startIdx + 1, lastIndex),
  ]

  try {
    const params = {
      Bucket: srcBucket,
      Key: srcKey,
    }
    var response = await s3.send(new GetObjectCommand(params))
    var stream = response.Body

    if (stream instanceof Readable) {
      var content_buffer = Buffer.concat(await stream.toArray())
    } else {
      throw new Error('Unknown object stream type')
    }
  } catch (error) {
    console.log(error)
    return
  }

  const BREAKPOINTS = {
    large: 1024,
    medium: 768,
    small: 640,
    thumbnail: 250,
  }

  try {
    const breakpointKeys = Object.keys(BREAKPOINTS)
    const { width, height, size } = await sharp(content_buffer).metadata()
    for (const key of breakpointKeys) {
      const breakpoint = BREAKPOINTS[key]
      const dstKey = `responsive/${path}/${key}_${filename}.webp`

      const imageBuffer = await sharp(content_buffer)
        .resize(breakpoint, null, {
          fit: 'inside',
        })
        .toFormat('webp')
        .toBuffer()
      const destinationParams = {
        Bucket: dstBucket,
        Key: dstKey,
        Body: imageBuffer,
        ContentType: 'image',
      }

      /**
       * Only want to generate responsive images if users upload
       * Images whose resolution exceeds display breakpoints
       * Images that are within breakpoints but are large
       */
      if (breakpoint < width || breakpoint < height) {
        await s3.send(new PutObjectCommand(destinationParams))

        console.log(
          'Successfully resized ' +
            srcBucket +
            '/' +
            srcKey +
            ' and uploaded to ' +
            dstBucket +
            '/' +
            dstKey,
        )
      } else if (breakpoint > width && breakpoint > height && size > 100000) {
        await s3.send(new PutObjectCommand(destinationParams))
        console.log(
          'Successfully resized small resolution image' +
            srcBucket +
            '/' +
            srcKey +
            ' and uploaded to ' +
            dstBucket +
            '/' +
            dstKey,
        )
      }
    }
  } catch (error) {
    console.log(error)
    return
  }
}
