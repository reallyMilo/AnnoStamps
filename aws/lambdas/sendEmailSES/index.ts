import { SendTemplatedEmailCommand, SESClient } from '@aws-sdk/client-ses'
import { createClient } from '@supabase/supabase-js'
import { Handler } from 'aws-lambda'

const ses = new SESClient({ region: 'eu-central-1' })

export const handler: Handler = async (event) => {
  const { body, targetUrl, userIdToNotify } = event

  const supabaseURL = process.env.SUPABASE_DB_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

  if (!supabaseURL || !supabaseServiceKey) {
    throw new Error('Missing supabase env')
  }
  const supabase = createClient(supabaseURL, supabaseServiceKey)

  const { data, error } = await supabase
    .from('User')
    .select()
    .eq('id', userIdToNotify)

  if (error) {
    console.error(error)
    throw new Error(JSON.stringify(error))
  }

  const templateData = {
    authorOfContent: body.authorOfContent,
    content: body.content,
    targetUrl: `https://annostamps.com${targetUrl}`,
    updateSettingsUrl: `https://annostamps.com/user/${data[0].id}/settings`,
  }

  const command = new SendTemplatedEmailCommand({
    ConfigurationSetName: 'rendering-failure',
    Destination: {
      ToAddresses: [data[0].email],
    },
    Source: 'AnnoStamps <noreply@email.annostamps.com>',
    Template: 'CommentNotificationTemplate',
    TemplateData: JSON.stringify(templateData),
  })

  try {
    await ses.send(command)
  } catch (e) {
    console.error(e)
  }
}
