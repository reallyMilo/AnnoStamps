import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'
import { useSession } from 'next-auth/react'

import UserMenu from '../UserMenu'

//FIXME: global use session mock
const mocks = vi.hoisted(() => {
  return {
    useSession: vi.fn(),
  }
})

vi.mock('next-auth/react', () => {
  return {
    SessionProvider: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    useSession: mocks.useSession,
  }
})

describe('UserMenu', () => {
  it('renders and has all links', () => {
    vi.mocked(useSession).mockReturnValueOnce({
      update: vi.fn(),
      data: null,
      status: 'unauthenticated',
    })
    render(<UserMenu />)

    expect(screen.getByText('Add Stamp')).toBeInTheDocument()
  })

  it('displays user-menu for authenticated users', () => {
    vi.mocked(useSession).mockReturnValueOnce({
      update: vi.fn(),
      data: {
        expires: new Date(Date.now() + 2 * 86400).toISOString(),
        user: { id: '1' },
      },
      status: 'authenticated',
    })

    render(<UserMenu />)

    expect(screen.getByTestId('user-menu')).toBeInTheDocument()
  })
})
