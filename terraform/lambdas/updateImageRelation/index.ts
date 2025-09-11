import { createClient } from '@supabase/supabase-js'
import { S3Event, S3Handler } from 'aws-lambda'
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'

import util from 'util'

const s3 = new S3Client({ region: 'eu-central-1' })

export const handler: S3Handler = async (event: S3Event) => {
  const supabaseURL = process.env.SUPABASE_DB_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY
  const cloudfrontURL = process.env.CLOUDFRONT_CDN_URL
  if (!supabaseURL || !supabaseServiceKey) {
    throw new Error('Missing supabase env')
  }

  console.log(
    'Reading options from event:\n',
    util.inspect(event, { depth: 5 }),
  )

  const srcBucket = event.Records[0].s3.bucket.name
  const srcKey = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, ' '),
  )

  const params = {
    Bucket: srcBucket,
    Key: srcKey,
  }
  const response = await s3.send(new GetObjectCommand(params))
  console.log('Metadata:\n', util.inspect(response.Metadata, { depth: 5 }))
  if (!response.Metadata) {
    console.error('No metadata set.')
    return
  }
  const id = response.Metadata.imageid
  const imageVariant = response.Metadata.imagevariant
  const supabase = createClient(supabaseURL, supabaseServiceKey)
  try {
    const { error } = await supabase
      .from('Image')
      .update({ [imageVariant]: cloudfrontURL + srcKey })
      .eq('id', id)

    if (error) {
      console.error(error)
    }
  } catch (e) {
    console.error(e)
  }
}
