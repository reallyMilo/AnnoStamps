import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { createId } from '@paralleldrive/cuid2'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'

import { authOptions } from '../auth/[...nextauth]'

interface Req extends NextApiRequest {
  query: { fileType: string; filename: string; stampId: string }
}
export default async function presignedHandler(req: Req, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session?.user?.id) {
    return res.status(401).json({ ok: false, message: 'Unauthorized.' })
  }

  const { AWS_S3_REGION, AWS_S3_BUCKET, AWS_S3_BUCKET_FOLDER } = process.env

  const { filename, fileType, stampId } = req.query

  const type = fileType === 'zip' ? 'stamps' : 'images'

  const path = `${AWS_S3_BUCKET_FOLDER}/${type}/${
    session.user.id
  }/${stampId}/${createId()}.${fileType}`

  const client = new S3Client({ region: AWS_S3_REGION })
  const command = new PutObjectCommand({
    Bucket: AWS_S3_BUCKET,
    Key: path,
    ContentType: fileType,
    Metadata: { filename },
  })

  const url = await getSignedUrl(client, command, { expiresIn: 3600 })

  return res.status(200).json({ url, path })
}
