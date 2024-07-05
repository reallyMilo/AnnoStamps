import { PrismaClient } from '@prisma/client'
import { defineConfig } from 'cypress'

const prisma = new PrismaClient()

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on) {
      on('task', {
        async 'db:query'(rawQuery: string) {
          const data = await prisma.$queryRawUnsafe(`${rawQuery}`)

          return data
        },
        async 'db:removeTestUser'() {
          return await prisma.$transaction([
            prisma.image.deleteMany({
              where: {
                OR: [
                  {
                    stampId: 'testSeedUserStampId',
                  },
                  { id: 'anno-stamps-logo' },
                ],
              },
            }),
            prisma.stamp.deleteMany({
              where: {
                userId: {
                  contains: 'testSeedUserId',
                },
              },
            }),
            prisma.session.delete({
              where: {
                id: 'testSeedUserSessionId',
              },
            }),
            prisma.account.delete({
              where: {
                id: 'testSeedAccountId',
              },
            }),
            prisma.user.delete({
              where: {
                id: 'testSeedUserId',
              },
            }),
          ])
        },
        async 'db:testUser'(setUsername?: boolean) {
          const username = {
            username: 'testSeedUser',
            usernameURL: 'testseeduser',
            biography: 'amazing test user bio',
          }
          const testSeedUser = {
            id: 'testSeedUserId',
            name: `testSeedUser`,
            email: `testSeedUser@example.com`,
            username: null,
            usernameURL: null,
            biography: null,
            ...(setUsername ? username : null),
          }
          return await prisma.$transaction([
            prisma.user.create({
              data: testSeedUser,
            }),
            prisma.account.create({
              data: {
                id: 'testSeedAccountId',
                userId: 'testSeedUserId',
                type: 'oauth',
                provider: 'discord',
                providerAccountId: '123213123123',
                access_token: 'abcdefghijklmnopqrst',
              },
            }),
            prisma.session.create({
              data: {
                id: 'testSeedUserSessionId',
                sessionToken: 'cdc4b0fb-77b5-44b5-947a-dde785af2676',
                userId: 'testSeedUserId',
                expires: '3000-01-01T00:00:00.000Z',
              },
            }),
            prisma.stamp.create({
              data: {
                id: 'testSeedUserStampId',
                userId: 'testSeedUserId',
                game: '1800',
                title: `Test-Seed-User-Stamp`,
                unsafeDescription: `Test seed user stamp`,
                markdownDescription: `<h1>Test seed user stamp</h1>`,
                category: 'cosmetic',
                region: 'old world',
                stampFileUrl: '/stamp.zip',
                downloads: 123,
                images: {
                  create: [
                    {
                      id: 'testSeedStampImageId',
                      originalUrl:
                        'https://placehold.co/2000x2000.png?text=Original',
                      largeUrl: `https://placehold.co/1024x576.png?text=Large`,
                      smallUrl: `https://placehold.co/500x281.png?text=Small`,
                    },
                  ],
                },
              },
            }),
          ])
        },
      })
    },
    video: false,
    chromeWebSecurity: false,
    env: {
      sessionToken: 'cdc4b0fb-77b5-44b5-947a-dde785af2676',
    },
  },
})
