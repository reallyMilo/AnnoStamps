import { PrismaClient, User } from '@prisma/client'

import { GOOD_CATEGORIES_1800 } from '../src/lib/game/1800/data'
import { getGoodRegion } from '../src/lib/game/1800/helpers'

const prisma = new PrismaClient()

const userData: Partial<User>[] = Array.from({ length: 100 }, (_, index) => ({
  name: `User ${index + 1}`,
  email: `user${index + 1}@example.com`,
  username: `user${index + 1}`,
  usernameURL: `user${index + 1}`,
  biography: `user${index + 1} amazing stamp creator`,
  discord: `user${index + 1}`,
  reddit: `user${index + 1}`,
  twitter: `user${index + 1}`,
  twitch: `user${index + 1}`,
}))

const folderImagePaths = [
  '/stamp-name.jpg',
  '/stamp-highlight.jpg',
  '/header.jpg',
]
async function seed() {
  const users: User[] = []

  for (const data of userData) {
    const user: User = await prisma.user.create({ data })
    users.push(user)
  }

  const stampData = Array.from({ length: 1000 }, (_, index) => {
    const goodCategories = Object.keys(GOOD_CATEGORIES_1800)
    const rndCategoryIndex = Math.floor(Math.random() * goodCategories.length)

    const associatedGoods =
      Object.values(GOOD_CATEGORIES_1800)[rndCategoryIndex].items
    const rndGoodIndex = Math.floor(Math.random() * associatedGoods.length)

    const goodCategory = goodCategories[rndCategoryIndex]
    const good = associatedGoods[rndGoodIndex].name

    const rndImage =
      folderImagePaths[Math.floor(Math.random() * folderImagePaths.length)]
    return {
      userId: users[index % users.length].id,
      game: '1800',
      title: `Stamp-${good}-${index}`,
      description: `Stamp-${good}-${index}`,
      category: 'production',
      region: getGoodRegion(good),
      imageUrl: rndImage,
      stampFileUrl: '/stamp.zip',
      townhall: index % 2 ? false : true,
      tradeUnion: index % 2 ? true : false,
      goodCategory: goodCategory.toLowerCase(),
      good: good.toLowerCase(),
      downloads: index,
    }
  })

  const stamp = await prisma.stamp.createMany({
    data: stampData,
  })

  const insertedStamps = await prisma.stamp.findMany()

  const updatedStamps = await Promise.all(
    insertedStamps.map((stamp) => {
      const selectUser = users[Math.floor(Math.random() * users.length)]
      return prisma.stamp.update({
        where: { id: stamp.id },
        data: {
          images: {
            createMany: {
              data: [1, 2].map((image) => ({
                originalUrl: `https://placehold.co/2000x2000.png?text=Original${image}\\n${stamp.id}`,
                thumbnailUrl: `https://placehold.co/250x250.png?text=Thumbnail${image}\\n${stamp.id}`,
                smallUrl: `https://placehold.co/500x500.png?text=Small${image}\\n${stamp.id}`,
                mediumUrl: `https://placehold.co/750x750.png?text=Medium${image}\\n${stamp.id}`,
                largeUrl: `https://placehold.ca/1000x1000.png?text=Large${image}\\n${stamp.id}`,
              })),
            },
          },
          likedBy: {
            connect: { id: selectUser.id },
          },
        },
      })
    })
  )

  console.log('Seed completed successfully')
}

seed()
  .catch((error) => {
    console.error(error)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
