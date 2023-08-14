import { Stamp, User } from '@prisma/client'
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

const NicknameView = ({ user, children }: NicknameViewProps) => {
  return (
    <Layout>
      <div className="w-full bg-[#8B6834] text-white">
        <Container className="py-4">
          <div className="grid grid-cols-2">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl">{user.nickname}</h1>
              <p className="text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
                vitae porttitor odio, eget feugiat leo. Maecenas bibendum nunc
                id tortor fringilla, eu fringilla eros mollis.
              </p>

              <div className="flex gap-4">
                <span>connect with me</span>
                <span>discord</span>
                <span>google</span>
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
const NicknamePage = () => {
  const router = useRouter()

  const nicknameURL =
    typeof router.query.nickname === 'string' ? router.query.nickname : ''

  const { data, error, isLoading } = useSWR(
    nicknameURL ? `/api/user/${nicknameURL}` : null,
    fetcher
  )

  if (error || !data?.stamps)
    return (
      <NicknameView user={{ nickname: nicknameURL }}>
        <p>User has no Stamps</p>
      </NicknameView>
    )
  if (isLoading)
    return (
      <NicknameView user={{ nickname: nicknameURL }}>
        <div className="h-8 w-[75px] animate-pulse rounded-md bg-gray-200" />
      </NicknameView>
    )

  return (
    <NicknameView user={data.user}>
      {data.stamps.map((stamp: Stamp) => (
        <StampCard key={stamp.id} {...stamp} />
      ))}
    </NicknameView>
  )
}

export default NicknamePage
