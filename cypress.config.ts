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
            prisma.notification.deleteMany({
              where: {
                OR: [
                  {
                    userId: 'testSeedUserId',
                  },
                  {
                    userId: 'replySeedUserId',
                  },
                ],
              },
            }),
            prisma.comment.deleteMany({
              where: {
                OR: [
                  {
                    userId: 'testSeedUserId',
                  },
                  { userId: 'replySeedUserId' },
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
            prisma.user.deleteMany({
              where: {
                OR: [
                  {
                    id: 'testSeedUserId',
                  },
                  {
                    id: 'replySeedUserId',
                  },
                ],
              },
            }),
          ])
        },
        async 'db:testUser'(setUsername = false) {
          const username = {
            biography: 'amazing test user bio',
            image: '/anno-stamps-logo.png',
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
            prisma.user.createMany({
              data: [
                testSeedUser,
                {
                  email: 'replySeedUser@example.com',
                  id: 'replySeedUserId',
                  username: 'replySeedUser',
                  usernameURL: 'replyseeduser',
                },
              ],
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
                comments: {
                  create: [
                    {
                      content: 'cypress seed comment',
                      id: 'cypressComment',
                      parentId: null,
                      userId: 'replySeedUserId',
                    },
                  ],
                },
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
            prisma.notification.create({
              data: {
                body: {
                  authorOfContent: 'replySeedUser',
                  authorOfContentUrl: 'replyseeduser',
                  content: 'great stamp!',
                },
                channel: 'web',
                id: 'testUserNotificationId',
                targetUrl: '/stamp/testSeedUserStampId',
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
