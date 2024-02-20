export const upload = async (
  stampId: string,
  body: Blob | File,
  type: string,
  name?: string
) => {
  const filename = name && encodeURIComponent(name)
  const fileType = encodeURIComponent(type)

  //TODO: Localstack or aws sandbox can remove this
  if (process.env.NODE_ENV === 'development') {
    const localRes = await fetch(
      `/api/upload/local?stampId=${stampId}&filename=${filename}&fileType=${fileType}`,
      {
        method: 'POST',
        body,
      }
    )

    if (localRes.ok) {
      const { message } = await localRes.json()
      return '/tmp/' + message
    }

    return undefined
  }

  const presigned = await fetch(
    `/api/upload/presigned?stampId=${stampId}&filename=${filename}&fileType=${fileType}`
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
