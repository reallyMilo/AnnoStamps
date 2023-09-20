import { PrismaClient } from '@prisma/client'

import { imageExtension, stampExtensions, userExtension } from './queries'

const prismaClientSingleton = () => {
  return new PrismaClient()
    .$extends(userExtension)
    .$extends(stampExtensions)
    .$extends(imageExtension)
}

export type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
