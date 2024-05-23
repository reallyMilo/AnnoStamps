import type { InferGetStaticPropsType } from 'next'

import { type getStaticProps } from '@/modules/users/views/users-view.getStaticProps'

export const UserBanner = ({
  user,
  stats,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <div className="mb-4 flex flex-col gap-y-2 border-b-2 pb-10">
      <div className="flex space-x-4 ">
        <h1 className="text-3xl">{user.username}</h1>
        <span className="self-end">{stats.downloads} Downloads</span>
        <span className="self-end">{stats.likes} Likes</span>
      </div>
      <p className="text-sm">{user?.biography}</p>
    </div>
  )
}
