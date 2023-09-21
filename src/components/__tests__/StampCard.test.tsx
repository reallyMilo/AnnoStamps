import { render as renderRTL, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useSession } from 'next-auth/react'

import { stampsMock } from '@/__mocks__/data'
import type { StampWithRelations } from '@/lib/prisma/queries'

import StampCard from '../StampCard'

const stamp = stampsMock[0]

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

vi.mocked(useSession).mockReturnValue({
  update: vi.fn(),
  data: null,
  status: 'unauthenticated',
})

describe('Stamp Card', () => {
  const render = (props?: Partial<StampWithRelations>) => ({
    ...renderRTL(<StampCard {...stamp} {...props} />),
    user: userEvent.setup(),
  })

  it('renders with all provided props', () => {
    render({
      id: 'urlID',
      title: 'Stamp Title',
      category: 'production',
      region: 'old world',
      modded: true,
      user: { ...stamp.user, username: 'stampCreator' },
      likedBy: [{ ...stamp.likedBy[0] }, { ...stamp.likedBy[0] }],
    })

    expect(screen.getByTestId('stamp-card-link')).toHaveAttribute(
      'href',
      '/stamp/urlID'
    )
    expect(screen.getByAltText('Stamp Title')).toBeInTheDocument()
    expect(screen.getByText('mods')).toBeInTheDocument()
    expect(screen.getByText('production')).toBeInTheDocument()
    expect(screen.getByText('old world')).toBeInTheDocument()
    expect(screen.getByText('stampCreator')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('hidden mod badge when modded is false', () => {
    render({ modded: false })

    expect(screen.queryByText('mods')).not.toBeInTheDocument()
  })
})
