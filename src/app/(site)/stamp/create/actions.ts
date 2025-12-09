'use server'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import { parseAndSanitizedMarkdown } from '@/lib/markdown'
import prisma from '@/lib/prisma/singleton'
import { Prisma } from '#/client'

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

export const createStamp = async (
  formData: FormData,
): Promise<{
  error: string
  ok: boolean
  status: number
}> => {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return { error: 'Unauthorized', ok: false, status: 401 }
  }

  if (!session.user.username) {
    return { error: 'Please set username', ok: false, status: 400 }
  }

  const {
    game,
    stampFileUrl,
    stampId,
    unsafeDescription,
    uploadedImageUrls,
    ...fields
  } = Object.fromEntries(formData) as unknown as FormDataEntries

  try {
    const sanitizedMarkdown = parseAndSanitizedMarkdown(unsafeDescription)

    const addImages = JSON.parse(uploadedImageUrls) as string[]

    await prisma.stamp.create({
      data: {
        game,
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
    return { error: 'Server error in creating stamp', ok: false, status: 500 }
  }

  const appendGameRoute = game === '117' ? '' : `/${game}`
  revalidatePath(`/${session.user.usernameURL}${appendGameRoute}`)
  revalidatePath(`/${session.userId}${appendGameRoute}`)
  redirect(`/${session.user.usernameURL}${appendGameRoute}`)
}
