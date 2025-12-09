import type { PrismaConfig } from 'prisma'

import 'dotenv/config'
import { env } from 'prisma/config'

export default {
  datasource: {
    url: env('DATABASE_URL'),
  },
  migrations: {
    path: './prisma/migrations',
    seed: 'tsx ./prisma/seed.ts',
  },
  schema: './prisma/schema.prisma',
} satisfies PrismaConfig
