import { Prisma } from '@prisma/client'
type StampWithLikes = Prisma.FactionGetPayload<{
  include: { likedBy: true }
}>
