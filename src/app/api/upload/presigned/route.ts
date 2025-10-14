import type { NextRequest } from 'next/server'

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { createId } from '@paralleldrive/cuid2'

import { auth } from '@/auth'

export const GET = async (request: NextRequest) => {
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  if (!session) {
    return Response.json({ error: 'Unauthorized', ok: false }, { status: 401 })
  }

  const { AWS_S3_BUCKET, AWS_S3_REGION } = process.env

  const searchParams = request.nextUrl.searchParams
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
      ? `${directory}/${session.userId}/${imageId}.${ext}`
      : `${directory}/${session.userId}/${stampId}/${imageId}.${ext}`

  const client = new S3Client({
    forcePathStyle: AWS_S3_REGION === 'us-east-1',
    region: AWS_S3_REGION,
  })
  const command = new PutObjectCommand({
    Bucket: AWS_S3_BUCKET,
    ContentType: fileType,
    Key: path,
    Metadata: {
      directory,
      filename: decodeURIComponent(filename),
      imageId,
      userId: session.userId,
      ...(stampId && { stampId }),
    },
  })

  const url = await getSignedUrl(client, command, { expiresIn: 300 })

  return Response.json({
    message: 'Returning presigned url.',
    ok: true,
    path,
    url:
      AWS_S3_REGION === 'us-east-1'
        ? `http://s3.localhost.localstack.cloud:4566/annostamps/${path}`
        : url,
  })
}
