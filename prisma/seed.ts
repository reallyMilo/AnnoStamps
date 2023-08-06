import { PrismaClient, User } from '@prisma/client'

import { GOOD_CATEGORIES_1800 } from '../game/1800/data'
import { getGoodRegion } from '../game/1800/helpers'

const prisma = new PrismaClient()

const userData: Partial<User>[] = Array.from({ length: 100 }, (_, index) => ({
  name: `User ${index + 1}`,
  email: `user${index + 1}@example.com`,
  nickname: `user${index + 1}`,
  nicknameURL: `user${index + 1}`,
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
      title: `Stamp-${goodCategory}-${good}-${index}`,
      description: `Stamp-${goodCategory}-${good}-${index}`,
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

  const insertedStamps = await prisma.stamp.findMany({ take: 250 })

  const updatedStamps = await Promise.all(
    insertedStamps.map((stamp) => {
      const selectUser = users[Math.floor(Math.random() * users.length)]
      return prisma.stamp.update({
        where: { id: stamp.id },
        data: {
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
