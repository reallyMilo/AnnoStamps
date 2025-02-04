import type { Handler } from 'aws-lambda'

export const handler: Handler = async (event) => {
  const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL
  if (!discordWebhookUrl) {
    throw new Error('DISCORD_WEBHOOK_URL')
  }

  const { body } = event
  const { record: stampData } = JSON.parse(body)

  const content = `[${stampData.title}](https://annostamps.com/stamp/${stampData.id})`

  try {
    const response = await fetch(discordWebhookUrl, {
      body: JSON.stringify({
        content,
      }),
      headers: {
        'Content-type': 'application/json',
      },
      method: 'POST',
    })

    return response
  } catch (e) {
    console.error(e)
    return
  }
}
