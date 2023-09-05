import { render, screen } from '@testing-library/react'

import HomePage from '@/pages'

const stamps = [
  {
    id: 'clll7fyxp002sem82uejwfey5',
    title: 'Stamp-Agricultural Products-Indigo Dye-0',
    category: 'production',
    region: 'old world',
    imageUrl: '/stamp-highlight.jpg',
    modded: true,
    user: {
      id: '1',
      username: 'UNIT-tester',
      usernameURL: 'unit-tester',
      image: null,
    },
    likedBy: [
      {
        id: 'clll7fytx0017em827ji8ry6b',
      },
    ],
  },
]
describe('Home Page', () => {
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

  it('render HomePage with filter and without stamps', () => {
    render(HomePage({ count: 0, stamps: [] }))

    expect(screen.getByLabelText('Category')).toBeInTheDocument()
    expect(screen.getByText('No stamps found.')).toBeInTheDocument()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it('displays pagination and stamps on HomePage', () => {
    render(HomePage({ count: 22, stamps }))

    expect(screen.getByText('UNIT-tester')).toBeInTheDocument()
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })
})
