import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { createId } from '@paralleldrive/cuid2'

import { auth } from '@/auth'

export const GET = auth(async (req) => {
  if (!req.auth) {
    return Response.json(
      { message: 'Unauthorized.', ok: false },
      { status: 401 },
    )
  }

  const { AWS_S3_BUCKET, AWS_S3_REGION } = process.env

  const searchParams = req.nextUrl.searchParams
  const stampId = searchParams.get('stampId')
  const filename = searchParams.get('filename')
  const fileType = searchParams.get('fileType')
  const directory = searchParams.get('directory')

  if (!filename || !fileType || !directory) {
    return Response.json(
      { message: 'Missing params field', ok: false },
      { status: 400 },
    )
  }

  const ext =
    fileType === 'zip' ? 'zip' : decodeURIComponent(fileType).split('/')[1]

  const imageId = createId()
  const path =
    directory === 'avatar'
      ? `${directory}/${req.auth.user.id}/${imageId}.${ext}`
      : `${directory}/${req.auth.user.id}/${stampId}/${imageId}.${ext}`

  const client = new S3Client({ region: AWS_S3_REGION })
  const command = new PutObjectCommand({
    Bucket: AWS_S3_BUCKET,
    ContentType: fileType,
    Key: path,
    Metadata: {
      directory,
      filename: decodeURIComponent(filename),
      imageId,
      userId: req.auth.user.id,
      ...(stampId && { stampId }),
    },
  })

  const url = await getSignedUrl(client, command, { expiresIn: 300 })

  return Response.json({
    message: 'Returning presigned url.',
    ok: true,
    path,
    url,
  })
})
