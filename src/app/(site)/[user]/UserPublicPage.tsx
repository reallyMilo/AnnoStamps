import type { UserWithStamps } from '@/lib/prisma/models'

import { Container, Heading, Text } from '@/components/ui'

export const UserPublicPage = ({
  biography,
  children,
  username,
}: React.PropsWithChildren<Pick<UserWithStamps, 'biography' | 'username'>>) => {
  return (
    <Container>
      <div className="mb-4 flex flex-col gap-y-2 border-b-2 pb-10">
        <div className="flex space-x-4">
          <Heading>{username}</Heading>
        </div>
        <Text className="text-sm">{biography}</Text>
      </div>
      {children}
    </Container>
  )
}
