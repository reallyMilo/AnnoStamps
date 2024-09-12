import { PrismaClient } from '@prisma/client'
import { defineConfig } from 'cypress'

const prisma = new PrismaClient()

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    chromeWebSecurity: false,
    env: {
      sessionToken: 'cdc4b0fb-77b5-44b5-947a-dde785af2676',
    },
    setupNodeEvents(on) {
      on('task', {
        async 'db:query'(rawQuery: string) {
          const data = await prisma.$queryRawUnsafe(`${rawQuery}`)

          return data
        },
        async 'db:removeTestUser'() {
          return await prisma.$transaction([
            prisma.preference.deleteMany({}),
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
            biography: 'amazing test user bio',
            username: 'testSeedUser',
            usernameURL: 'testseeduser',
          }
          const testSeedUser = {
            biography: null,
            email: `testSeedUser@example.com`,
            id: 'testSeedUserId',
            name: `testSeedUser`,
            username: null,
            usernameURL: null,
            ...(setUsername ? username : null),
          }
          return await prisma.$transaction([
            prisma.user.create({
              data: testSeedUser,
            }),
            prisma.account.create({
              data: {
                access_token: 'abcdefghijklmnopqrst',
                id: 'testSeedAccountId',
                provider: 'discord',
                providerAccountId: '123213123123',
                type: 'oauth',
                userId: 'testSeedUserId',
              },
            }),
            prisma.session.create({
              data: {
                expires: '3000-01-01T00:00:00.000Z',
                id: 'testSeedUserSessionId',
                sessionToken: 'cdc4b0fb-77b5-44b5-947a-dde785af2676',
                userId: 'testSeedUserId',
              },
            }),
            prisma.stamp.create({
              data: {
                category: 'cosmetic',
                downloads: 123,
                game: '1800',
                id: 'testSeedUserStampId',
                images: {
                  create: [
                    {
                      id: 'testSeedStampImageId',
                      largeUrl: `https://placehold.co/1024x576.png?text=Large`,
                      originalUrl:
                        'https://placehold.co/2000x2000.png?text=Original',
                      smallUrl: `https://placehold.co/500x281.png?text=Small`,
                    },
                  ],
                },
                markdownDescription: `<h1>Test seed user stamp</h1>`,
                region: 'old world',
                stampFileUrl: '/stamp.zip',
                title: `Test-Seed-User-Stamp`,
                unsafeDescription: `Test seed user stamp`,
                userId: 'testSeedUserId',
              },
            }),
          ])
        },
      })
    },
    video: false,
  },
})
