import { Popover } from '@headlessui/react'
import { EnvelopeIcon } from '@heroicons/react/24/outline'
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Image from 'next/image'

import Grid from '@/components/Layout/Grid'
import StampCard from '@/components/StampCard'
import Container from '@/components/ui/Container'
import { userIncludeStatement, UserWithStamps } from '@/lib/prisma/queries'
import prisma from '@/lib/prisma/singleton'

type UsernamePageProps = {
  user: UserWithStamps
}

export const getServerSideProps: GetServerSideProps<
  UsernamePageProps
> = async ({ query, res }) => {
  const user = await prisma.user.findUnique({
    include: userIncludeStatement,
    where: { usernameURL: query.username as string },
  })

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=15, stale-while-revalidate=59'
  )

  if (!user) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      user,
    },
  }
}

const UsernamePage = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <div className="w-full bg-[#8B6834] text-white">
        <Container className="py-4">
          <div className="grid grid-cols-4">
            <div className="col-span-3 flex flex-col gap-y-2">
              <h1 className="text-2xl">{user?.username}</h1>
              <p className="text-sm">{user?.biography}</p>

              <div className="flex items-center gap-4">
                {user?.discord && (
                  <Popover className="relative flex">
                    <Popover.Button className="self-center">
                      <Image
                        width={30}
                        height={30}
                        className="h-[30px] w-[30px]"
                        alt="discord username"
                        src="/discord-white-icon.svg"
                      />
                    </Popover.Button>

                    <Popover.Panel className="absolute top-10 z-10">
                      <span className="border bg-white p-2 text-black">
                        {user.discord}
                      </span>
                    </Popover.Panel>
                  </Popover>
                )}
                {user?.reddit && (
                  <a href={`https://reddit.com/u/${user.reddit}`}>
                    <Image
                      width={30}
                      height={30}
                      alt="reddit username"
                      src="/reddit_icon_snoo.svg"
                    />
                  </a>
                )}
                {user?.emailContact && (
                  <a href={`mailto:${user.emailContact}`}>
                    <EnvelopeIcon className="h-[30px] w-[30px]" />
                  </a>
                )}
                {user?.twitch && (
                  <a href={`https://twitch.com/${user.twitch}`}>
                    <Image
                      width={30}
                      height={30}
                      className="h-[30px] w-[30px]"
                      alt="twitch username"
                      src="/TwitchGlitchWhite.svg"
                    />
                  </a>
                )}
                {user?.twitter && (
                  <a href={`https://twitter.com/${user.twitter}`}>
                    <Image
                      width={30}
                      height={30}
                      className="h-[30px] w-[30px]"
                      alt="twitter handle"
                      src="/twitter-logo.svg"
                    />
                  </a>
                )}
              </div>
            </div>
          </div>
        </Container>
      </div>
      <Container>
        <Grid>
          {' '}
          {user.listedStamps.length === 0 ? (
            <p>User has no stamps</p>
          ) : (
            user?.listedStamps.map((stamp) => (
              <StampCard key={stamp.id} user={user} {...stamp} />
            ))
          )}
        </Grid>
      </Container>
    </>
  )
}

export default UsernamePage
