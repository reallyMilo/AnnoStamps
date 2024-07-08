import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { createId } from '@paralleldrive/cuid2'

import { auth } from '@/auth'

export const GET = auth(async (req) => {
  if (!req.auth) {
    return Response.json(
      { ok: false, message: 'Unauthorized.' },
      { status: 401 },
    )
  }

  const { AWS_S3_REGION, AWS_S3_BUCKET } = process.env

  const searchParams = req.nextUrl.searchParams
  const stampId = searchParams.get('stampId')
  const filename = searchParams.get('filename')
  const fileType = searchParams.get('fileType')

  if (!stampId || !filename || !fileType) {
    return Response.json(
      { message: 'Missing params field', ok: false },
      { status: 400 },
    )
  }

  const type = fileType === 'zip' ? 'stamps' : 'images'
  const ext =
    fileType === 'zip' ? 'zip' : decodeURIComponent(fileType).split('/')[1]

  const path = `${type}/${req.auth.user.id}/${stampId}/${createId()}.${ext}`

  const client = new S3Client({ region: AWS_S3_REGION })
  const command = new PutObjectCommand({
    Bucket: AWS_S3_BUCKET,
    Key: path,
    ContentType: fileType,
    Metadata: { filename: decodeURIComponent(filename) },
  })

  const url = await getSignedUrl(client, command, { expiresIn: 3600 })

  return Response.json({
    url,
    path,
    ok: true,
    message: 'Returning presigned url.',
  })
})
