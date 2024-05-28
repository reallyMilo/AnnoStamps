import type { InferGetStaticPropsType } from 'next'

import { Heading, Text } from '@/components/ui'
import type { getStaticProps } from '@/modules/users/views/users-view.getStaticProps'

export const UserBanner = ({
  user,
  stats,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <div className="mb-4 flex flex-col gap-y-2 border-b-2 pb-10">
      <div className="flex space-x-4 ">
        <Heading>{user.username}</Heading>
        <Text className="self-end">{stats.downloads} Downloads</Text>
        <Text className="self-end">{stats.likes} Likes</Text>
      </div>
      <Text className="text-sm">{user?.biography}</Text>
    </div>
  )
}
