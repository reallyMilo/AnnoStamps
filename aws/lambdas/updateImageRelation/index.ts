import { createClient } from '@supabase/supabase-js'
import { S3Event, S3Handler } from 'aws-lambda'
export const handler: S3Handler = async (event: S3Event) => {
  const supabaseURL = process.env.SUPABASE_DB_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

  if (!supabaseURL || !supabaseServiceKey) {
    throw new Error('Missing supabase env')
  }

  const srcKey = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, ' '),
  )

  const startKeyIdx = srcKey.lastIndexOf('/')
  const start = srcKey.lastIndexOf('_')
  const end = srcKey.lastIndexOf('.')
  const id = srcKey.slice(start + 1, end)
  const key = srcKey.slice(startKeyIdx + 1, start)

  const appendUrl = key + 'Url'

  const supabase = createClient(supabaseURL, supabaseServiceKey)
  try {
    const { error } = await supabase
      .from('Image')
      .update({ [appendUrl]: 'https://d16532dqapk4x.cloudfront.net/' + srcKey })
      .eq('id', id)

    if (error) {
      console.error(error)
    }
  } catch (e) {
    console.error(e)
  }
}
