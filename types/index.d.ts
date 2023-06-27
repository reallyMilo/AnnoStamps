// https://www.prisma.io/docs/concepts/components/prisma-client/advanced-type-safety/operating-against-partial-structures-of-model-types
import { Prisma } from '@prisma/client'
import { Category } from 'game/1800/enum'

const stampWithLikes = Prisma.validator<Prisma.StampArgs>()({
  include: { likedBy: true },
})
type StampWithLikes = Prisma.StampGetPayload<typeof stampWithLikes>

interface CreateStamp extends Prisma.StampCreateInput {
  category: Category
}
