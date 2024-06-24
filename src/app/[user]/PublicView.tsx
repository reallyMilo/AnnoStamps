import { StampCard } from '@/components/StampCard'
import { Container, Grid, Text } from '@/components/ui'
import type { UserWithStamps } from '@/lib/prisma/models'

import { UserBanner } from './UserBanner'

type UserPublicPageProps = {
  stats: { downloads: number; likes: number }
  user: UserWithStamps
}
export const UserPublicPage = ({ user, stats }: UserPublicPageProps) => {
  const { username, biography } = user
  const userBannerProps = { ...stats, username, biography }

  if (user.listedStamps.length === 0) {
    return (
      <Container>
        <UserBanner {...userBannerProps} />
        <Text>User has no stamps</Text>
      </Container>
    )
  }

  return (
    <Container>
      <UserBanner {...userBannerProps} />
      <Grid>
        {user.listedStamps.map((stamp) => (
          <StampCard key={stamp.id} user={user} {...stamp} />
        ))}
      </Grid>
    </Container>
  )
}
