import { Popover } from '@headlessui/react'
import { XCircleIcon } from '@heroicons/react/20/solid'
import { EnvelopeIcon } from '@heroicons/react/24/outline'
import type { User } from '@prisma/client'
import Image from 'next/image'
import { useRouter } from 'next/router'
import useSWR from 'swr'

import Grid from '@/components/Layout/Grid'
import Layout from '@/components/Layout/Layout'
import StampCard from '@/components/StampCard'
import Container from '@/components/ui/Container'
import { fetcher } from '@/lib/utils'

type NicknameViewProps = {
  children: React.ReactNode
  user: Partial<User>
}
const UsernameView = ({ user, children }: NicknameViewProps) => {
  return (
    <Layout>
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
        <Grid>{children}</Grid>
      </Container>
    </Layout>
  )
}
const UsernamePage = () => {
  const router = useRouter()

  const usernameURL =
    typeof router.query.username === 'string' ? router.query.username : ''

  const { data, error, isLoading } = useSWR(
    usernameURL ? `/api/user/${usernameURL}` : null,
    fetcher
  )

  if (error)
    return (
      <UsernameView user={{ username: usernameURL }}>
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon
                className="h-5 w-5 text-red-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                {error.info.message}
              </h3>
            </div>
          </div>
        </div>
      </UsernameView>
    )
  if (isLoading)
    return (
      <UsernameView user={{ username: usernameURL }}>
        <div className="h-8 w-[75px] animate-pulse rounded-md bg-gray-200" />{' '}
      </UsernameView>
    )

  return (
    <UsernameView user={data?.user}>
      {data?.user.listedStamps.length === 0 ? (
        <p>User has no stamps</p>
      ) : (
        data?.user.listedStamps.map((stamp: any) => (
          <StampCard key={stamp.id} {...stamp} />
        ))
      )}
    </UsernameView>
  )
}

export default UsernamePage
