import { PrismaClient } from '@prisma/client'

import { stampExtensions, userExtension } from './queries'

const prismaClientSingleton = () => {
  return new PrismaClient().$extends(userExtension).$extends(stampExtensions)
}

export type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
