import { SendTemplatedEmailCommand, SESClient } from '@aws-sdk/client-ses'
import { createClient } from '@supabase/supabase-js'
const ses = new SESClient({ region: 'eu-central-1' })

export const handler = async (event) => {
  const { body, stampId, targetUrl, userIdToNotify } = JSON.parse(event)

  const supabase = createClient(
    process.env.SUPA_DB,
    process.env.SUPA_SERVICE_KEY,
  )

  const { data, error } = await supabase
    .from('User')
    .select()
    .eq('id', userIdToNotify)

  if (error) {
    console.log(error)
    return
  }
  const command = new SendTemplatedEmailCommand({
    Destination: {
      ToAddresses: [data[0].email],
    },
    Source: 'noreply@annostamps.com',
    Template: 'CommentNotificationTemplate',
    TemplateData: event,
  })

  try {
    await ses.send(command)
  } catch (e) {
    console.log(e)
  }
}
