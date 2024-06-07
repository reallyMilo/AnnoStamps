import { createId } from '@paralleldrive/cuid2'
import { PrismaClient, User } from '@prisma/client'

import { CATEGORIES } from '../src/lib/constants'
import {
  ARCTIC_GOODS,
  ENBESA_GOODS,
  NEW_WORLD_GOODS,
  OLD_WORLD_GOODS,
  REGIONS_1800,
} from '../src/lib/constants/1800/data'

const prisma = new PrismaClient()

const categories = Object.values(CATEGORIES)
const region = Object.values(REGIONS_1800)
const goods = [OLD_WORLD_GOODS, NEW_WORLD_GOODS, ENBESA_GOODS, ARCTIC_GOODS]

export const generateUserData = (
  length: number
): Omit<User, 'image' | 'emailVerified'>[] =>
  Array.from({ length }, (_, index) => ({
    id: createId(),
    name: `User ${index + 1}`,
    email: `user${index + 1}@example.com`,
    username: `user${index + 1}`,
    usernameURL: `user${index + 1}`,
    biography: `user${index + 1} amazing stamp creator`,
  }))

export const generateStampData = (
  length: number,
  users: Omit<User, 'image' | 'emailVerified'>[]
) =>
  Array.from({ length: length }, (_, index) => {
    const categoryIdx = Math.floor(Math.random() * categories.length)
    const rndCategory = categories[categoryIdx]

    const regionIdx = Math.floor(Math.random() * region.length)
    const rndRegion = region[regionIdx]

    const getGood = () => {
      const goodsInRegion = goods[regionIdx]
      const goodIdx = Math.floor(Math.random() * goodsInRegion.length)
      const rndGood = goodsInRegion[goodIdx]
      return rndGood.toLowerCase()
    }
    const getCapital = () => {
      if (rndCategory === 'island' && rndRegion === 'new world') {
        return 'manola'
      }
      return null
    }

    return {
      id: createId(),
      userId: users[index % users.length].id,
      game: '1800',
      title: `Stamp-${index}`,
      unsafeDescription: `Stamp-${index}`,
      markdownDescription: `<h1> Stamp-${index} </h1>`,
      category: rndCategory,
      region: rndRegion,
      modded: index % 20 === 0 ? true : false,
      stampFileUrl: 'http://localhost:3000/test-stamp.zip',
      good: rndCategory === 'production' ? getGood() : null,
      capital: getCapital(),
      downloads: index,
    }
  })

export const generatePlaceHoldImages = () => {
  return [1, 2].map((image) => {
    const id = createId()
    return {
      id,
      originalUrl: `https://placehold.co/2000x2000.png?text=Original${image}\\n${id}`,
      thumbnailUrl: `https://placehold.co/250x250.png?text=Thumbnail${image}\\n${id}`,
      smallUrl: `https://placehold.co/500x281.png?text=Small${image}\\n${id}`,
      mediumUrl: `https://placehold.co/750x421.png?text=Medium${image}\\n${id}`,
      largeUrl: `https://placehold.co/1024x576.png?text=Large${image}\\n${id}`,
    }
  })
}
async function seed() {
  const userData = generateUserData(100)
  const stampData = generateStampData(1000, userData)
  await prisma.user.createMany({ data: userData })

  await prisma.stamp.createMany({
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
            data: generatePlaceHoldImages(),
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
