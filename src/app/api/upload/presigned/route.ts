import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { createId } from '@paralleldrive/cuid2'
import { NextApiRequest, NextApiResponse } from 'next'

import { auth } from '@/auth'

interface Req extends NextApiRequest {
  query: { fileType: string; filename: string; stampId: string }
}
export default async function presignedHandler(req: Req, res: NextApiResponse) {
  const session = await auth(req, res)

  if (!session?.user?.id) {
    return res.status(401).json({ ok: false, message: 'Unauthorized.' })
  }

  const { AWS_S3_REGION, AWS_S3_BUCKET } = process.env

  const { filename, fileType, stampId } = req.query

  const type = fileType === 'zip' ? 'stamps' : 'images'
  const ext =
    fileType === 'zip' ? 'zip' : decodeURIComponent(fileType).split('/')[1]

  const path = `${type}/${session.user.id}/${stampId}/${createId()}.${ext}`

  const client = new S3Client({ region: AWS_S3_REGION })
  const command = new PutObjectCommand({
    Bucket: AWS_S3_BUCKET,
    Key: path,
    ContentType: fileType,
    Metadata: { filename: decodeURIComponent(filename) },
  })

  const url = await getSignedUrl(client, command, { expiresIn: 3600 })

  return res.status(200).json({ url, path })
}
