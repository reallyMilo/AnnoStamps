import '@testing-library/jest-dom'

import { render as renderRTL, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useSession } from 'next-auth/react'
import type { StampWithRelations } from 'types'

import StampCard from '../StampCard'

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
    ...renderRTL(
      <StampCard
        id="urlID"
        title="Stamp Title"
        category="production"
        region="old world"
        imageUrl="/stamp-highlight.jpg"
        modded
        likedBy={[{ id: '1' }, { id: '2' }]}
        user={{
          id: '1024',
          username: 'stampCreator',
          usernameURL: 'stampcreator',
          image: null,
        }}
        {...props}
      />
    ),
    user: userEvent.setup(),
  })

  it('renders with all provided props', () => {
    render()

    expect(screen.getByTestId('stamp-card-link')).toHaveAttribute(
      'href',
      '/stamp/urlID'
    )
    expect(screen.getByAltText('Stamp Title')).toBeInTheDocument()
    expect(screen.getByText('mods')).toBeInTheDocument()
    expect(screen.getByText('Stamp Title')).toBeInTheDocument()
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
