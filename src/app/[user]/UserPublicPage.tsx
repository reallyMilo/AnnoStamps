import { StampCard } from '@/components/StampCard'
import { Container, Grid, Heading, Text } from '@/components/ui'
import type { UserWithStamps } from '@/lib/prisma/models'

type UserBannerProps = {
  stampCount: number
} & Pick<UserWithStamps, 'biography' | 'username'>

const UserPublicBanner = ({
  username,
  biography,
  stampCount,
}: UserBannerProps) => {
  return (
    <div className="mb-4 flex flex-col gap-y-2 border-b-2 pb-10">
      <div className="flex space-x-4">
        <Heading>{username}</Heading>
        {stampCount > 0 && (
          <Text className="self-end">{stampCount} Stamps</Text>
        )}
      </div>
      <Text className="text-sm">{biography}</Text>
    </div>
  )
}
export const UserPublicPage = ({ user }: { user: UserWithStamps }) => {
  const { username, biography } = user
  const userBannerProps = {
    username,
    biography,
    stampCount: user.listedStamps.length,
  }

  if (user.listedStamps.length === 0) {
    return (
      <Container>
        <UserPublicBanner {...userBannerProps} />
        <Text>User has no stamps</Text>
      </Container>
    )
  }

  return (
    <Container>
      <UserPublicBanner {...userBannerProps} />
      <Grid>
        {user.listedStamps.map((stamp) => (
          <StampCard key={stamp.id} user={user} {...stamp} />
        ))}
      </Grid>
    </Container>
  )
}
