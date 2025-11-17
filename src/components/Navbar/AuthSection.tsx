import '@/app/globals.css'
import { getSession } from '@/auth'
import { UserDropdownButton } from '@/components/Navbar/UserDropdownButton'
import { Button } from '@/components/ui'

export const AuthSection = async () => {
  const session = await getSession()

  if (!session) {
    return <Button href="/auth/signin">Add Stamp</Button>
  }

  return <UserDropdownButton />
}
