import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { S3Event, S3Handler } from 'aws-lambda'
import sharp from 'sharp'
import { Readable } from 'stream'
import util from 'util'

const s3 = new S3Client({ region: 'eu-central-1' })

export const handler: S3Handler = async (event: S3Event) => {
  console.log(
    'Reading options from event:\n',
    util.inspect(event, { depth: 5 }),
  )
  const srcBucket = event.Records[0].s3.bucket.name

  const srcKey = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, ' '),
  )
  const dstBucket = srcBucket
  const path = srcKey.substring(0, srcKey.lastIndexOf('/'))

  let content_buffer = null
  let metadata = null
  try {
    const params = {
      Bucket: srcBucket,
      Key: srcKey,
    }
    const response = await s3.send(new GetObjectCommand(params))
    console.log('Metadata:\n', util.inspect(response.Metadata, { depth: 5 }))
    const stream = response.Body
    metadata = response.Metadata
    if (stream instanceof Readable) {
      content_buffer = Buffer.concat(await stream.toArray())
    } else {
      throw new Error('Unknown object stream type')
    }
  } catch (error) {
    console.error(error)
    return
  }

  const BREAKPOINTS = {
    large: 1024,
    medium: 768,
    small: 640,
    thumbnail: 250,
  } as const

  if (!metadata) {
    console.error('Metadata was not set')
    return
  }
  const imageId = metadata.imageid

  try {
    const { height, size, width } = await sharp(content_buffer).metadata()
    for (const [key, value] of Object.entries(BREAKPOINTS)) {
      const breakpoint = value
      const dstKey = `responsive/${path}/${key}_${imageId}.webp`

      const imageBuffer = await sharp(content_buffer)
        .resize(breakpoint, null, {
          fit: 'inside',
        })
        .toFormat('webp')
        .toBuffer()
      const destinationParams = {
        Body: imageBuffer,
        Bucket: dstBucket,
        ContentType: 'image',
        Key: dstKey,
        Metadata: { ...metadata, imageVariant: `${key}Url` },
      }

      //TODO: attach size,width,height meta tags to object on client upload.
      //@ts-expect-error undefined
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
        //@ts-expect-error undefined
      } else if (size > 100000) {
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
      } else {
        console.warn(
          `${srcKey} object did not have responsive image generated for: ${key}:${value}`,
        )
      }
    }
  } catch (error) {
    console.error(error)
    return
  }
}
