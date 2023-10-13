export const upload = async (
  body: Blob | File,
  mime: string,
  name?: string
) => {
  const filename = name && encodeURIComponent(name)
  const fileType = encodeURIComponent(mime)

  //TODO: Localstack or aws sandbox can remove this
  if (process.env.NODE_ENV === 'development') {
    const reader = (file: File) =>
      new Promise((resolve, reject) => {
        const fr = new FileReader()
        fr.onload = () => resolve(fr)
        fr.onerror = (err) => reject(err)
        fr.readAsDataURL(file)
      })

    const fileResult = (await reader(body as File)) as FileReader
    const localRes = await fetch(
      `/api/upload/local?filename=${filename}&fileType=${fileType}`,
      {
        method: 'POST',
        body: fileResult.result,
      }
    )

    return ''
  }

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
