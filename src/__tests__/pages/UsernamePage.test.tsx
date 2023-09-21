import { render, screen } from '@testing-library/react'

import { userStampsMock } from '@/__mocks__/data'
import UsernamePage from '@/pages/[username]'

describe('UsernamePage', () => {
  vi.mock('next/router', () => ({
    useRouter() {
      return {
        route: '/user1',
        pathname: '',
        query: {},
        asPath: '',
      }
    },
  }))
  vi.mock('next-auth/react', () => ({
    useSession() {
      return {
        undefined,
      }
    },
  }))
  it('renders and all provided fields', () => {
    render(<UsernamePage user={userStampsMock} />)

    expect(screen.queryByText('user1', { selector: 'h1' })).toBeInTheDocument()
    expect(screen.getByText('user1 amazing stamp creator')).toBeInTheDocument()
  })
  it('displays no user found', () => {
    render(<UsernamePage user={null} />)

    expect(screen.getByText('User not found')).toBeInTheDocument()
  })
  it('notifies user has no stamps', () => {
    userStampsMock.listedStamps = []
    render(<UsernamePage user={userStampsMock} />)

    expect(screen.getByText('user1')).toBeInTheDocument()
    expect(screen.getByText('User has no stamps')).toBeInTheDocument()
  })
})
