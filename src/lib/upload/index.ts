export const upload = async (body: BodyInit, mime: string, name?: string) => {
  const filename = name && encodeURIComponent(name)
  const fileType = encodeURIComponent(mime)

  //TODO: Localstack or aws sandbox
  // if (process.env.NODE_ENV === 'development') {
  //   return
  // }

  const presigned = await fetch(
    `/api/upload/presigned?filename=${filename}&fileType=${fileType}`
  )
  const { url, path }: { path: string; url: string } = await presigned.json()

  const putObject = await fetch(url, {
    method: 'PUT',
    body,
  })

  if (putObject.ok) {
    return 'https://d16532dqapk4x.cloudfront.net/' + path
  }
  return undefined
}
