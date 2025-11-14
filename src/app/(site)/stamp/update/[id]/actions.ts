'use server'
import type { Prisma } from '@prisma/client'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import { parseAndSanitizedMarkdown } from '@/lib/markdown'
import prisma from '@/lib/prisma/singleton'

type FormDataEntries = Pick<
  Prisma.StampUncheckedCreateInput,
  | 'category'
  | 'game'
  | 'modded'
  | 'region'
  | 'stampFileUrl'
  | 'title'
  | 'unsafeDescription'
> & {
  imageIdsToRemove: string
  stampId: string
  uploadedImageUrls: string
}

export const updateStamp = async (formData: FormData) => {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return { error: 'Unauthorized', ok: false, status: 401 }
  }

  if (!session.user.username) {
    return { error: 'Please set username', ok: false, status: 400 }
  }

  const {
    game,
    imageIdsToRemove,
    stampId,
    unsafeDescription,
    uploadedImageUrls,
    ...fields
  } = Object.fromEntries(formData) as unknown as FormDataEntries

  const deleteImages = JSON.parse(imageIdsToRemove) as string[]
  const addImages = JSON.parse(uploadedImageUrls) as string[]
  let prevVersion = null
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
          id: session.userId,
        },
      })
      if (userStamp?.listedStamps.length === 0) {
        throw new Error('Not stamp owner')
      }
      prevVersion = userStamp?.listedStamps[0].game

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
          game,
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
    return { error: 'Server error in updating stamp', ok: false, status: 500 }
  }

  revalidatePath(`/stamp/${stampId}`)

  const appendGameRoute = game === '117' ? '' : `/${game}`
  const oldRoute = prevVersion === '117' ? '' : `/${prevVersion}`
  if (prevVersion !== game) {
    revalidatePath(`/${session.user.usernameURL}${oldRoute}`)
    revalidatePath(`/${session.userId}${oldRoute}`)
  }

  revalidatePath(`/${session.user.usernameURL}${appendGameRoute}`)
  revalidatePath(`/${session.userId}${appendGameRoute}`)
  redirect(`/${session.user.usernameURL}${appendGameRoute}`)
}
