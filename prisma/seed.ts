import { createId } from '@paralleldrive/cuid2'
import { PrismaClient, User } from '@prisma/client'

import {
  ARCTIC_GOODS,
  ENBESA_GOODS,
  NEW_WORLD_GOODS,
  OLD_WORLD_GOODS,
  REGIONS_1800,
} from '../src/lib/game/1800/data'

const prisma = new PrismaClient()

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
    const regionIdx = Math.floor(Math.random() * 4)
    const regionArray = goods[regionIdx]
    const goodIdx = Math.floor(Math.random() * regionArray.length)
    const good = regionArray[goodIdx]
    const id = createId()
    return {
      id,
      userId: users[index % users.length].id,
      game: '1800',
      title: `Stamp-${good}-${index}`,
      description: `Stamp-${good}-${index}`,
      category: 'production',
      region: region[regionIdx],
      stampFileUrl: '/stamp.zip',
      collection: index % 2 ? false : true,
      good: good.toLowerCase(),
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

  const testSeedUser = {
    id: 'testSeedUserId',
    name: `testSeedUser`,
    email: `testSeedUser@example.com`,
    username: `testSeedUser`,
    usernameURL: `testseeduser`,
    biography: `testseeduser amazing stamp creator`,
  }
  await prisma.user.create({
    data: testSeedUser,
  })

  await prisma.stamp.create({
    data: {
      id: 'testSeedUserStampId',
      userId: 'testSeedUserId',
      game: '1800',
      title: `Test-Seed-User-Stamp`,
      description: `Test seed user stamp`,
      category: 'cosmetic',
      region: 'old world',
      stampFileUrl: '/stamp.zip',
      collection: true,
      downloads: 123,
      images: {
        create: [
          {
            id: 'TestSeedStampImageId',
            originalUrl: 'https://placehold.co/2000x2000.png?text=Original',
            largeUrl: `https://placehold.co/1024x576.png?text=Large`,
            smallUrl: `https://placehold.co/500x281.png?text=Small`,
          },
        ],
      },
    },
  })

  console.log('Seed completed successfully')
}

seed()
  .catch((error) => {
    console.error(error)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
