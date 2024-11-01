export const handler = async (event) => {
  console.log(event)

  const { body } = event
  const { record: stampData } = JSON.parse(body)

  console.log(stampData)

  const content = `[${stampData.title}](https://annostamps.com/stamp/${stampData.id})`

  try {
    const response = await fetch(process.env.DISCORD_WEBHOOK_URL, {
      body: JSON.stringify({
        content,
      }),
      headers: {
        'Content-type': 'application/json',
      },
      method: 'POST',
    })

    console.log(response)
    return response
  } catch (e) {
    console.log(e)
    return
  }
}
