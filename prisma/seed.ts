import { createId } from '@paralleldrive/cuid2'
import { PrismaClient, User } from '@prisma/client'

import { GOOD_CATEGORIES_1800 } from '../src/lib/game/1800/data'
import { getGoodRegion } from '../src/lib/game/1800/helpers'

const prisma = new PrismaClient()

export const seedUserData = (
  length: number
): Omit<User, 'image' | 'emailVerified'>[] => {
  return Array.from({ length }, (_, index) => ({
    id: createId(),
    name: `User ${index + 1}`,
    email: `user${index + 1}@example.com`,
    username: `user${index + 1}`,
    usernameURL: `user${index + 1}`,
    emailContact: `user${index + 1}@example.com`,
    biography: `user${index + 1} amazing stamp creator`,
    discord: `user${index + 1}`,
    reddit: `user${index + 1}`,
    twitter: `user${index + 1}`,
    twitch: `user${index + 1}`,
  }))
}

export const seedStampData = (
  length: number,
  users: Omit<User, 'image' | 'emailVerified'>[]
) => {
  return Array.from({ length }, (_, index) => {
    const goodCategories = Object.keys(GOOD_CATEGORIES_1800)
    const rndCategoryIndex = Math.floor(Math.random() * goodCategories.length)

    const associatedGoods =
      Object.values(GOOD_CATEGORIES_1800)[rndCategoryIndex].items
    const rndGoodIndex = Math.floor(Math.random() * associatedGoods.length)

    const good = associatedGoods[rndGoodIndex].name
    const id = createId()
    return {
      id,
      userId: users[index % users.length].id,
      game: '1800',
      title: `Stamp-${good}-${index}`,
      description: `Stamp-${good}-${index}`,
      category: 'production',
      region: getGoodRegion(good),
      stampFileUrl: '/stamp.zip',
      collection: index % 2 ? false : true,
      townhall: index % 2 ? false : true,
      tradeUnion: index % 2 ? true : false,
      good: good.toLowerCase(),
      downloads: index,
    }
  })
}

export const seedImages = () => {
  return [1, 2].map((image) => {
    const id = createId()
    return {
      id,
      originalUrl: `https://placehold.co/2000x2000.png?text=Original${image}\\n${id}`,
      thumbnailUrl: `https://placehold.co/250x250.png?text=Thumbnail${image}\\n${id}`,
      smallUrl: `https://placehold.co/500x500.png?text=Small${image}\\n${id}`,
      mediumUrl: `https://placehold.co/750x750.png?text=Medium${image}\\n${id}`,
      largeUrl: `https://placehold.ca/1000x1000.png?text=Large${image}\\n${id}`,
    }
  })
}

const userData = seedUserData(100)
const stampData = seedStampData(1000, userData)

async function seed() {
  await prisma.user.createMany({ data: userData })

  const stamp = await prisma.stamp.createMany({
    data: stampData,
  })

  for (const stamp of stampData) {
    const selectUser = userData[Math.floor(Math.random() * userData.length)]
    await prisma.stamp.update({
      where: {
        id: stamp.id,
      },
      data: {
        likedBy: {
          connect: { id: selectUser.id },
        },
        images: {
          createMany: {
            data: seedImages(),
          },
        },
      },
    })
  }

  console.log('Seed completed successfully')
}

seed()
  .catch((error) => {
    console.error(error)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
