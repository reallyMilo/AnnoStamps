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
        async 'db:seed'() {
          // use main seed for now
        },
        async 'db:removeTestUser'() {
          await prisma.image.deleteMany({
            where: {
              OR: [
                {
                  stampId: 'testSeedUserStampId',
                },
                { id: 'anno-stamps-logo' },
              ],
            },
          })

          await prisma.stamp.deleteMany({
            where: {
              userId: {
                contains: 'testSeedUserId',
              },
            },
          })

          await prisma.session.delete({
            where: {
              id: 'testSeedUserSessionId',
            },
          })
          await prisma.account.delete({
            where: {
              id: 'testSeedAccountId',
            },
          })
          return await prisma.user.delete({
            where: {
              id: 'testSeedUserId',
            },
          })
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

          await prisma.user.create({
            data: testSeedUser,
          })
          await prisma.account.create({
            data: {
              id: 'testSeedAccountId',
              userId: 'testSeedUserId',
              type: 'oauth',
              provider: 'discord',
              providerAccountId: '123213123123',
              access_token: 'abcdefghijklmnopqrst',
            },
          })
          await prisma.session.create({
            data: {
              id: 'testSeedUserSessionId',
              sessionToken: 'cdc4b0fb-77b5-44b5-947a-dde785af2676',
              userId: 'testSeedUserId',
              expires: '3000-01-01T00:00:00.000Z',
            },
          })

          return await prisma.stamp.create({
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
                    id: 'testSeedStampImageId',
                    originalUrl:
                      'https://placehold.co/2000x2000.png?text=Original',
                    largeUrl: `https://placehold.co/1024x576.png?text=Large`,
                    smallUrl: `https://placehold.co/500x281.png?text=Small`,
                  },
                ],
              },
            },
          })
        },
      })
    },
    video: false,
    chromeWebSecurity: false,
    env: {
      sessionToken: 'cdc4b0fb-77b5-44b5-947a-dde785af2676',
      csrfToken:
        'dfbc1c2ed29dd90157662042a479720a4bf4c394f954bdd2e01a372aa42c9f1b%7C426823b50e26ac90384ba7a800b10b79c4d19202dd2a5e1f80739d2c7594db44',
    },
  },
})
