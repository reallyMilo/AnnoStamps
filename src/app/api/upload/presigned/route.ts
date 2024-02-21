import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { createId } from '@paralleldrive/cuid2'
import qs from 'qs'
import z from 'zod'

import { auth } from '@/auth'

export const dynamic = 'force-dynamic'

const schema = z.object({
  stampId: z.string(),
  filename: z.string(),
  fileType: z.string(),
})

export const GET = auth(async (request) => {
  if (!request.auth) {
    return Response.json({ message: 'Not authenticated' }, { status: 401 })
  }
  const { AWS_S3_REGION, AWS_S3_BUCKET } = process.env

  const searchParams = request.nextUrl.searchParams
  const queryString = qs.parse(searchParams.toString())
  const { stampId, filename, fileType } = schema.parse(queryString)

  const type = fileType === 'zip' ? 'stamps' : 'images'
  const ext =
    fileType === 'zip' ? 'zip' : decodeURIComponent(fileType).split('/')[1]

  const path = `${type}/${request.auth.user.id}/${stampId}/${createId()}.${ext}`

  const client = new S3Client({ region: AWS_S3_REGION })
  const command = new PutObjectCommand({
    Bucket: AWS_S3_BUCKET,
    Key: path,
    ContentType: fileType,
    Metadata: { filename },
  })

  const url = await getSignedUrl(client, command, { expiresIn: 3600 })

  return Response.json({ url, path }, { status: 200 })
})
