import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seed() {
  // Create 40 users
  const users = []
  for (let i = 0; i < 40; i++) {
    const user = await prisma.user.create({
      data: {
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        nickname: `user${i + 1}`,
      },
    })
    users.push(user)
  }

  // Create 40 stamps with associated users
  for (let i = 0; i < 40; i++) {
    await prisma.stamp.create({
      data: {
        userId: users[i].id,
        game: `Game ${i + 1}`,
        title: `Stamp ${i + 1}`,
        description: `Description for Stamp ${i + 1}`,
        category: i % 3 ? 'Housing' : 'Production Chain',
        region: i % 2 ? 'Old World' : 'New World',
        screenshot: '/stamp-highlight.jpg',
        stamp: 'stampFile',
        modded: i % 2 === 0,
        liked: i,
        downloads: i,
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
