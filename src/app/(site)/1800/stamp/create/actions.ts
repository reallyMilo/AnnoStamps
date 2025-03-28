'use server'
import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import { parseAndSanitizedMarkdown } from '@/lib/markdown'
import prisma from '@/lib/prisma/singleton'

type FormDataEntries = {
  imageIdsToRemove: string
  stampId: string
  uploadedImageUrls: string
} & Pick<
  Prisma.StampUncheckedCreateInput,
  | 'category'
  | 'modded'
  | 'region'
  | 'stampFileUrl'
  | 'title'
  | 'unsafeDescription'
>

export const createStamp = async (
  formData: FormData,
): Promise<{
  message: string
  ok: boolean
}> => {
  const session = await auth()

  if (!session) {
    return { message: 'Unauthorized.', ok: false }
  }
  if (!session.user.usernameURL) {
    return { message: 'UsernameURL not set.', ok: false }
  }

  const fromDataEntries = Object.fromEntries(formData)
  try {
    const {
      stampFileUrl,
      stampId,
      unsafeDescription,
      uploadedImageUrls,
      ...fields
    } = fromDataEntries as unknown as FormDataEntries

    const sanitizedMarkdown = parseAndSanitizedMarkdown(unsafeDescription)

    const addImages = JSON.parse(uploadedImageUrls) as string[]

    await prisma.stamp.create({
      data: {
        game: '1800',
        id: stampId,
        images: {
          create: addImages.map((image) => {
            const start = image.lastIndexOf('/')
            const end = image.lastIndexOf('.')
            const id = image.slice(start + 1, end)
            return {
              id,
              originalUrl: image,
            }
          }),
        },
        markdownDescription: sanitizedMarkdown,
        stampFileUrl,
        unsafeDescription,
        userId: session.userId,
        ...fields,
      },
    })
  } catch (e) {
    console.error(e)
    return { message: 'Server error in creating stamps', ok: false }
  }

  revalidatePath(`/${session.user.usernameURL}`)
  revalidatePath(`/${session.userId}`)
  redirect(`/${session.user.usernameURL}`)
}
