'use server'
import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import { parseAndSanitizedMarkdown } from '@/lib/markdown'
import prisma from '@/lib/prisma/singleton'

type FormDataEntries = Pick<
  Prisma.StampUncheckedCreateInput,
  | 'category'
  | 'region'
  | 'unsafeDescription'
  | 'title'
  | 'modded'
  | 'stampFileUrl'
> & { imageIdsToRemove: string; stampId: string; uploadedImageUrls: string }

export const createStamp = async (
  formData: FormData
): Promise<{
  message: string
  ok: boolean
}> => {
  const session = await auth()

  if (!session?.user?.id) {
    return { ok: false, message: 'Unauthorized.' }
  }
  if (!session.user.usernameURL) {
    return { ok: false, message: 'UsernameURL not set.' }
  }

  const fromDataEntries = Object.fromEntries(formData)
  try {
    const {
      uploadedImageUrls,
      stampId,
      stampFileUrl,
      unsafeDescription,
      ...fields
    } = fromDataEntries as unknown as FormDataEntries

    const sanitizedMarkdown = parseAndSanitizedMarkdown(unsafeDescription)

    const addImages = JSON.parse(uploadedImageUrls) as string[]

    await prisma.stamp.create({
      data: {
        id: stampId,
        userId: session.user.id,
        game: '1800',
        stampFileUrl,
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
        unsafeDescription,
        markdownDescription: sanitizedMarkdown,
        ...fields,
      },
    })
  } catch (e) {
    console.error(e)
    return { ok: false, message: 'Server error in creating stamps' }
  }

  revalidatePath(`/${session.user.usernameURL}`)
  redirect(`/${session.user.usernameURL}`)
}
