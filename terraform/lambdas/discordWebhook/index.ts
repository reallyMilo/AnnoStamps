import type { Handler } from 'aws-lambda'

export const handler: Handler = async (event) => {
  if (
    !process.env.DISCORD_WEBHOOK_1800_URL ||
    !process.env.DISCORD_WEBHOOK_117_URL
  ) {
    throw new Error('DISCORD_WEBHOOK_URL')
  }

  const { body } = event
  const { record: stampData } = JSON.parse(body)

  const content = `[${stampData.title}](https://annostamps.com/stamp/${stampData.id})`

  const discordWebhookUrl =
    stampData.game === '117'
      ? process.env.DISCORD_WEBHOOK_117_URL
      : process.env.DISCORD_WEBHOOK_1800_URL

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
