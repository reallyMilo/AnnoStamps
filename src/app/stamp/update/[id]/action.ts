'use server'
import type { Prisma } from '@prisma/client'
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

export const updateStamp = async (formData: FormData) => {
  const session = await auth()

  if (!session?.user.id) {
    return { ok: false, message: 'Unauthorized.' }
  }

  if (!session.user.usernameURL) {
    return { ok: false, message: 'UsernameURL not set' }
  }

  const {
    stampId,
    imageIdsToRemove,
    uploadedImageUrls,
    unsafeDescription,
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
        where: {
          id: stampId,
        },
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
          unsafeDescription,
          markdownDescription,
          ...fields,
        },
      })
    })
  } catch (e) {
    console.error(e)
    return { ok: false, message: 'Server error.' }
  }
  revalidatePath(`/stamp/${stampId}`)
  revalidatePath(`/${session.user.usernameURL}`)
  redirect(`/${session.user.usernameURL}`)
}
