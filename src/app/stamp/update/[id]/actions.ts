'use server'
import type { Prisma } from '@prisma/client'

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

export const updateStamp = async (formData: FormData) => {
  const session = await auth()

  if (!session?.user.id) {
    return { message: 'Unauthorized.', ok: false }
  }

  if (!session.user.usernameURL) {
    return { message: 'UsernameURL not set', ok: false }
  }

  const {
    imageIdsToRemove,
    stampId,
    unsafeDescription,
    uploadedImageUrls,
    ...fields
  } = Object.fromEntries(formData) as unknown as FormDataEntries

  const deleteImages = JSON.parse(imageIdsToRemove) as string[]
  const addImages = JSON.parse(uploadedImageUrls) as string[]
  try {
    const markdownDescription = parseAndSanitizedMarkdown(unsafeDescription)
    await prisma.$transaction(async (tx) => {
      const userStamp = await tx.user.findUnique({
        select: {
          listedStamps: {
            where: {
              id: stampId,
            },
          },
        },
        where: {
          id: session.user.id,
        },
      })
      if (userStamp?.listedStamps.length === 0) {
        throw new Error('Not stamp owner')
      }

      if (deleteImages.length > 0) {
        await tx.image.deleteMany({
          where: {
            id: {
              in: deleteImages,
            },
          },
        })
      }

      return await tx.stamp.update({
        data: {
          ...(addImages.length > 0 && {
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
          }),
          changedAt: new Date().toISOString(),
          markdownDescription,
          unsafeDescription,
          ...fields,
        },
        where: {
          id: stampId,
        },
      })
    })
  } catch (e) {
    console.error(e)
    return { message: 'Server error.', ok: false }
  }
  revalidatePath(`/stamp/${stampId}`)
  revalidatePath(`/${session.user.usernameURL}`)
  revalidatePath(`/${session.userId}`)
  redirect(`/${session.user.usernameURL}`)
}
