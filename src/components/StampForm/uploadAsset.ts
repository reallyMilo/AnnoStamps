export const uploadAsset = async (
  body: Blob | File,
  type: string,
  name: string,
  directory: 'avatar' | 'images' | 'stamps',
  stampId?: string,
) => {
  const filename = encodeURIComponent(name)
  const fileType = encodeURIComponent(type)

  if (process.env.NODE_ENV === 'development') {
    const localRes = await fetch(
      `/api/upload/local?stampId=${stampId}&filename=${filename}&fileType=${fileType}&directory=${directory}`,
      {
        body,
        method: 'POST',
      },
    )

    if (!localRes.ok) {
      throw new Error('Failed local upload')
    }
    const { path }: { path: string } = await localRes.json()
    return path
  }

  const presigned = await fetch(
    `/api/upload/presigned?stampId=${stampId}&filename=${filename}&fileType=${fileType}&directory=${directory}`,
  )
  const { path, url }: { path: string; url: string } = await presigned.json()

  try {
    const putObject = await fetch(url, {
      body,
      method: 'PUT',
    })

    if (!putObject.ok) {
      throw new Error(putObject.statusText)
    }
    return 'https://d16532dqapk4x.cloudfront.net/' + path
  } catch (e) {
    return Promise.reject(new Error(`Upload failed: ${e}`))
  }
}
