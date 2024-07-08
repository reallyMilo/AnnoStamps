import { createClient } from '@supabase/supabase-js'

export const handler = async (event) => {
  const srcKey = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, ' '),
  )

  const startKeyIdx = srcKey.lastIndexOf('/')
  const start = srcKey.lastIndexOf('_')
  const end = srcKey.lastIndexOf('.')
  const id = srcKey.slice(start + 1, end)
  const key = srcKey.slice(startKeyIdx + 1, start)

  const appendUrl = key + 'Url'

  const supabase = createClient(
    process.env.SUPA_DB,
    process.env.SUPA_SERVICE_KEY,
  )
  try {
    const { error } = await supabase
      .from('Image')
      .update({ [appendUrl]: 'https://d16532dqapk4x.cloudfront.net/' + srcKey })
      .eq('id', id)

    console.log(error)
  } catch (e) {
    console.log(e)
  }
}
