import { PrismaClient } from '@prisma/client'
import { defineConfig } from 'cypress'
import crypto from 'node:crypto'

const prisma = new PrismaClient({
  datasourceUrl: 'postgresql://annouser:annouser@localhost:5433/annostamps',
})
const SESSION_TOKEN = '00000000000000000000000000000000'
export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    chromeWebSecurity: false,
    env: {},
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
                    stampId: 'testSeed1800StampId',
                  },
                  {
                    stampId: 'testSeed117StampId',
                  },
                  { originalUrl: { contains: 'localhost' } },
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
                userId: 'testSeedUserId',
              },
            }),
            prisma.session.create({
              data: {
                expires: '3000-01-01T00:00:00.000Z',
                id: 'testSeedUserSessionId',
                sessionToken: SESSION_TOKEN,
                userId: 'testSeedUserId',
              },
            }),
            prisma.stamp.createMany({
              data: [
                {
                  category: 'production',
                  downloads: 200000,
                  game: '117',
                  id: 'testSeed117StampId',
                  markdownDescription: `<h1>117 test stamp</h1>`,
                  region: 'rome',
                  stampFileUrl: '/stamp.zip',
                  title: '117 Test stamp',
                  unsafeDescription: `117 test stamp`,
                  userId: 'testSeedUserId',
                },
                {
                  category: 'cosmetic',
                  downloads: 123,
                  game: '1800',
                  id: 'testSeed1800StampId',
                  markdownDescription: `<h1>Test seed user stamp</h1>`,
                  region: 'old world',
                  stampFileUrl: '/stamp.zip',
                  title: `Test-Seed-User-Stamp`,
                  unsafeDescription: `Test seed user stamp`,
                  userId: 'testSeedUserId',
                },
              ],
            }),
            prisma.image.createMany({
              data: [
                {
                  id: 'testSeed1800ImageId',
                  largeUrl: `https://placehold.co/1024x576.png?text=Large`,
                  originalUrl:
                    'https://placehold.co/2000x2000.png?text=Original',
                  smallUrl: `https://placehold.co/500x281.png?text=Small`,
                  stampId: 'testSeed1800StampId',
                },
                {
                  id: 'testSeed117ImageId',
                  largeUrl: `https://placehold.co/1024x576.png?text=Large2`,
                  originalUrl:
                    'https://placehold.co/2000x2000.png?text=Original2',
                  smallUrl: `https://placehold.co/500x281.png?text=Small2`,
                  stampId: 'testSeed117StampId',
                },
              ],
            }),
            prisma.comment.create({
              data: {
                content: 'cypress seed comment',
                id: 'cypressComment',
                parentId: null,
                stampId: 'testSeed1800StampId',
                userId: 'replySeedUserId',
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
                targetUrl: '/stamp/testSeed1800StampId',
                userId: 'testSeedUserId',
              },
            }),
          ])
        },
        signedCookie() {
          const signature = crypto
            .createHmac('sha256', process.env.BETTER_AUTH_SECRET!)
            .update(SESSION_TOKEN)
            .digest('base64')
          const signedValue = `${SESSION_TOKEN}.${signature}`
          return signedValue
        },
      })
    },
    video: false,
  },
})
