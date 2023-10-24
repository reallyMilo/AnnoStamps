import { render as renderRTL, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { stampsMock } from '@/__mocks__/data'
import { StampWithRelations } from '@/lib/prisma/queries'
import StampPage from '@/pages/stamp/[id]'

const stamp = { ...stampsMock[0], collection: true }

vi.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
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

const render = (props?: Partial<StampWithRelations>) => ({
  ...renderRTL(<StampPage stamp={{ ...stamp, ...props }} />),
  user: userEvent.setup(),
})

describe('Stamp Page', () => {
  it('renders with all provided fields', () => {
    render({
      title: 'Stamp-Raw Material-Wood-998',
      description: 'best stamp for wood',
      category: 'production',
      collection: true,
      modded: true,
      region: 'old world',
      downloads: 998,
      good: 'minerals',
    })

    expect(screen.getByText('Stamp-Raw Material-Wood-998')).toBeInTheDocument()
    expect(screen.getByText('best stamp for wood')).toBeInTheDocument()
    expect(screen.getByText('production')).toBeInTheDocument()
    expect(screen.getByText('old world')).toBeInTheDocument()
    expect(screen.getByText('minerals')).toBeInTheDocument()
    expect(screen.getByText('mods')).toBeInTheDocument()
    expect(screen.getByText('Collection')).toBeInTheDocument()
    expect(screen.getByText('998')).toBeInTheDocument()
    expect(screen.getByRole('img')).toBeInTheDocument()
  })
  it('does not display false props', () => {
    render({
      collection: false,
      modded: false,
    })
    expect(screen.queryByText('mods')).not.toBeInTheDocument()
    expect(screen.queryByText('collection')).not.toBeInTheDocument()
  })
})
