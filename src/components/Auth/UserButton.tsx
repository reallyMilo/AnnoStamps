import { auth } from '@/auth'
import { Button } from '@/components/ui'

import { UserMenu } from './UserMenu'

export const UserButton = async () => {
  const session = await auth()

  if (!session) return <Button href="/auth/signin">Add Stamp</Button>

  return <UserMenu {...session.user} />
}
