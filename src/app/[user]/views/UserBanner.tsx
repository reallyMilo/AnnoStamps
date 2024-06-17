import { Heading, Text } from '@/components/ui'
import type { UserWithStamps } from '@/lib/prisma/queries'

type UserBannerProps = {
  downloads: number
  likes: number
} & Pick<UserWithStamps, 'biography' | 'username'>

export const UserBanner = ({
  username,
  biography,
  downloads,
  likes,
}: UserBannerProps) => {
  return (
    <div className="mb-4 flex flex-col gap-y-2 border-b-2 pb-10">
      <div className="flex space-x-4 ">
        <Heading>{username}</Heading>
        <Text className="self-end">{downloads} Downloads</Text>
        <Text className="self-end">{likes} Likes</Text>
      </div>
      <Text className="text-sm">{biography}</Text>
    </div>
  )
}
