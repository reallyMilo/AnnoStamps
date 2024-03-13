import type { UserWithStamps } from '@/lib/prisma/queries'
import UsernamePage from '@/pages/[username]'

import { render, screen } from '../test-utils'

const stats = {
  downloads: 10,
  likes: 5,
}
const userStamp = {
  id: 'clmsefb2r0000k9xxwsnklpvm',
  username: 'user1',
  usernameURL: 'user1',
  biography: 'user1 amazing stamp creator',
  listedStamps: [
    {
      id: 'clmsefb56002sk9xx1b58g39b',
      userId: 'clmsefb2r0000k9xxwsnklpvm',
      createdAt: 1695253939,
      changedAt: 1695253939,
      updatedAt: 1695253939,
      modded: false,
      downloads: 0,
      images: [],
    },
  ],
} as unknown as UserWithStamps

describe('UsernamePage', () => {
  it('renders and all provided fields', () => {
    render(<UsernamePage user={userStamp} stats={stats} />)

    expect(screen.queryByText('user1', { selector: 'h1' })).toBeInTheDocument()
    expect(screen.getByText('user1 amazing stamp creator')).toBeInTheDocument()
  })

  it('notifies user has no stamps', () => {
    userStamp.listedStamps = []
    render(<UsernamePage user={userStamp} stats={stats} />)

    expect(screen.getByText('user1')).toBeInTheDocument()
    expect(screen.getByText('User has no stamps')).toBeInTheDocument()
  })
})
