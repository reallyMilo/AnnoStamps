export const uploadAsset = async (
  body: Blob | File,
  type: string,
  name: string,
  directory: 'avatar' | 'images' | 'stamps',
  stampId?: string,
) => {
  const filename = encodeURIComponent(name)
  const fileType = encodeURIComponent(type)

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
    return `${process.env.NEXT_PUBLIC_CLOUDFRONT_CDN}/${path}`
  } catch (e) {
    console.log(e)
    return Promise.reject(new Error(`Upload failed: ${e}`))
  }
}
