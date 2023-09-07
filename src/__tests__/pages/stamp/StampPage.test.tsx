import { render, screen } from '@testing-library/react'

import StampPage from '@/pages/stamp/[id]'

const stamp = {
  id: 'clll7fyy600uiem822sm6s4oy',
  title: 'Stamp-Raw Material-Wood-998',
  description: 'best stamp for wood',
  imageUrl: '/stamp-name.jpg',
  stampFileUrl: 'http://localhost:3000/anno-stamps-logo.svg',
  category: 'production',
  region: 'old world',
  modded: false,
  downloads: 998,
  likedBy: [],
}

describe('Stamp Page', () => {
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

  it('renders with all provided fields', () => {
    render(<StampPage stamp={stamp} />)

    expect(screen.getByText('Stamp-Raw Material-Wood-998')).toBeInTheDocument()
    expect(screen.getByText('best stamp for wood')).toBeInTheDocument()
    expect(screen.getByText('production')).toBeInTheDocument()
    expect(screen.getByText('old world')).toBeInTheDocument()
    expect(screen.getByText('998')).toBeInTheDocument()
    expect(screen.getByRole('img')).toBeInTheDocument()
  })
})
