import { faker } from '@faker-js/faker'
import { createId } from '@paralleldrive/cuid2'
import { PrismaClient, type User } from '@prisma/client'

import { CATEGORIES } from '../src/lib/constants'
import { REGIONS_1800 } from '../src/lib/constants/1800/data'

const prisma = new PrismaClient()

const categories = Object.values(CATEGORIES)
const region = Object.values(REGIONS_1800)

export const generateUserData = (
  length: number,
): Omit<User, 'emailVerified' | 'image'>[] =>
  Array.from({ length }, () => {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    const username = faker.internet
      .username({ firstName, lastName })
      .replace(/\./g, '_')

    return {
      biography: faker.person.bio(),
      email: faker.internet.email({
        firstName,
        lastName,
        provider: 'example.fakerjs.dev',
      }),
      id: createId(),
      name: faker.person.fullName({ firstName, lastName }),
      username,
      usernameURL: username.toLowerCase(),
    }
  })

export const generateStampData = (
  length: number,
  users: Omit<User, 'emailVerified' | 'image'>[],
) =>
  Array.from({ length: length }, (_, index) => {
    const categoryIdx = Math.floor(Math.random() * categories.length)
    const rndCategory = categories[categoryIdx]

    const regionIdx = Math.floor(Math.random() * region.length)
    const rndRegion = region[regionIdx]

    const getCapital = () => {
      if (rndCategory === 'island' && rndRegion === 'new world') {
        return 'manola'
      }
      return null
    }

    const timestamp = faker.date.past()

    if (index % 2 === 0) {
      return {
        category: rndCategory,
        changedAt: timestamp,
        createdAt: timestamp,
        downloads: faker.number.int({ max: 1000000, min: 0 }),
        game: '117',
        id: createId(),
        markdownDescription: `<h2> Stamp-${index} </h2>`,
        modded: index % 20 === 0 ? true : false,
        region: 'rome',
        stampFileUrl: 'http://localhost:3000/test-stamp.zip',
        title: `Stamp-${index}-${faker.lorem.words({ max: 12, min: 0 })}`,
        unsafeDescription: `## Stamp-${index}`,
        updatedAt: timestamp,
        userId: users[index % users.length].id,
      }
    }

    return {
      capital: getCapital(),
      category: rndCategory,
      changedAt: timestamp,
      createdAt: timestamp,
      downloads: faker.number.int({ max: 1000000, min: 0 }),
      game: '1800',
      id: createId(),
      markdownDescription: `<h2> Stamp-${index} </h2>`,
      modded: index % 20 === 0 ? true : false,
      region: rndRegion,
      stampFileUrl: 'http://localhost:3000/test-stamp.zip',
      title: `Stamp-${index}-${faker.lorem.words({ max: 12, min: 0 })}`,
      unsafeDescription: `## Stamp-${index}`,
      updatedAt: timestamp,
      userId: users[index % users.length].id,
    }
  })

export const generatePlaceHoldImages = () => {
  return [1, 2].map((image) => {
    const id = createId()
    return {
      id,
      largeUrl: `https://placehold.co/1024x576.png?text=Large${image}\\n${id}`,
      mediumUrl: `https://placehold.co/750x421.png?text=Medium${image}\\n${id}`,
      originalUrl: `https://placehold.co/2000x2000.png?text=Original${image}\\n${id}`,
      smallUrl: `https://placehold.co/500x281.png?text=Small${image}\\n${id}`,
      thumbnailUrl: `https://placehold.co/250x250.png?text=Thumbnail${image}\\n${id}`,
    }
  })
}
async function seed() {
  console.time('Database seed time elapsed')
  const userData = generateUserData(100)
  const stampData = generateStampData(1000, userData)
  await prisma.user.createMany({ data: userData })

  await prisma.stamp.createMany({
    data: stampData,
  })

  for (const stamp of stampData) {
    const selectUser = userData[Math.floor(Math.random() * userData.length)]
    await prisma.stamp.update({
      data: {
        images: {
          createMany: {
            data: generatePlaceHoldImages(),
          },
        },
        likedBy: {
          connect: { id: selectUser.id },
        },
      },
      where: {
        id: stamp.id,
      },
    })
  }

  await prisma.$transaction([
    prisma.user.create({
      data: {
        email: 'filterSeedUser@example.com',
        id: 'filterSeedUserId',
        username: 'filterSeedUser',
        usernameURL: 'filterseeduser',
      },
    }),
    prisma.stamp.createMany({
      data: [
        ...Array.from({ length: 30 }).map((_, i) => ({
          category: i % 2 === 0 ? 'cosmetic' : 'production',
          downloads: 100 + i,
          game: '117',
          id: `filterSeedUser117StampId_${i}`,
          markdownDescription: `<h1>117 Test Stamp ${i}</h1>`,
          region: 'rome',
          stampFileUrl: 'http://localhost:3000/test-stamp.zip',
          title: `117 Test Stamp ${i}`,
          unsafeDescription: `117 test stamp ${i}`,
          userId: 'filterSeedUserId',
        })),
        ...Array.from({ length: 30 }).map((_, i) => ({
          category: i % 2 === 0 ? 'cosmetic' : 'production',
          downloads: 50 + i,
          game: '1800',
          id: `filterSeedUser1800StampId_${i}`,
          markdownDescription: `<h1>1800 Test Stamp ${i}</h1>`,
          region: i % 2 === 0 ? 'old world' : 'new world',
          stampFileUrl: 'http://localhost:3000/test-stamp.zip',
          title: `1800 Test Stamp ${i}`,
          unsafeDescription: `1800 test stamp ${i}`,
          userId: 'filterSeedUserId',
        })),
      ],
    }),
    prisma.image.createMany({
      data: [
        ...Array.from({ length: 30 }).map((_, i) => ({
          id: `filterSeedUser117ImageId_${i}`,
          largeUrl: `https://placehold.co/1024x576.png?text=Large117_${i}`,
          originalUrl: `https://placehold.co/2000x2000.png?text=Original117_${i}`,
          smallUrl: `https://placehold.co/500x281.png?text=Small117_${i}`,
          stampId: `filterSeedUser117StampId_${i}`,
        })),
        ...Array.from({ length: 30 }).map((_, i) => ({
          id: `filterSeedUser1800ImageId_${i}`,
          largeUrl: `https://placehold.co/1024x576.png?text=Large1800_${i}`,
          originalUrl: `https://placehold.co/2000x2000.png?text=Original1800_${i}`,
          smallUrl: `https://placehold.co/500x281.png?text=Small1800_${i}`,
          stampId: `filterSeedUser1800StampId_${i}`,
        })),
      ],
    }),
  ])

  console.timeEnd('Database seed time elapsed')
  console.log('Seed completed successfully')
}

seed()
  .catch((error) => {
    console.error(error)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
