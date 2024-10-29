import { SendTemplatedEmailCommand, SESClient } from '@aws-sdk/client-ses'
import { createClient } from '@supabase/supabase-js'
const ses = new SESClient({ region: 'eu-central-1' })

export const handler = async (event) => {
  const { body, targetUrl, userIdToNotify } = event

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
    const res = await ses.send(command)
    console.log(res)
  } catch (e) {
    console.log(e)
  }
}
