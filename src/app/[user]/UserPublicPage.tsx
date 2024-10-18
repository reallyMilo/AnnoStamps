import type { UserWithStamps } from '@/lib/prisma/models'

import { StampCard } from '@/components/StampCard'
import { Container, Grid, Heading, Text } from '@/components/ui'

export const UserPublicPage = ({
  biography,
  id,
  image,
  listedStamps,
  username,
  usernameURL,
}: UserWithStamps) => {
  const stampCount = listedStamps.length

  return (
    <Container>
      <div className="mb-4 flex flex-col gap-y-2 border-b-2 pb-10">
        <div className="flex space-x-4">
          <Heading>{username}</Heading>
          {stampCount > 0 && (
            <Text className="self-end">{stampCount} Stamps</Text>
          )}
        </div>
        <Text className="text-sm">{biography}</Text>
      </div>
      <Grid>
        {stampCount > 0 ? (
          listedStamps.map((stamp) => (
            <StampCard
              key={stamp.id}
              user={{ id, image, username, usernameURL }}
              {...stamp}
            />
          ))
        ) : (
          <Text>User has no stamps</Text>
        )}
      </Grid>
    </Container>
  )
}
