import { render, screen } from '@testing-library/react'

import UsernamePage from '@/pages/[username]'

const user = {
  id: 'clll7fyse0000em82dlc6m56j',
  username: 'user1',
  usernameURL: 'user1',
  image: null,
  discord: null,
  reddit: 'user1-reddit',
  emailContact: null,
  twitch: 'user1-twitch',
  twitter: 'user1-twitter',
  biography: 'the greatest stamper',
  listedStamps: [
    {
      id: 'clll7fyxp002sem82uejwfey5',
      userId: 'clll7fyse0000em82dlc6m56j',
      game: '1800',
      title: 'Stamp-Agricultural Products-Indigo Dye-0',
      description: 'Stamp-Agricultural Products-Indigo Dye-0',
      category: 'production',
      region: 'old world',
      imageUrl: '/stamp-highlight.jpg',
      stampFileUrl: '/stamp.zip',
      goodCategory: 'agricultural products',
      good: 'indigo dye',
      population: null,
      capital: null,
      townhall: true,
      tradeUnion: false,
      createdAt: '2023-08-21T18:22:47.189Z',
      updatedAt: '2023-08-21T18:22:47.189Z',
      modded: false,
      downloads: 0,
      likedBy: [
        {
          id: 'clll7fytx0017em827ji8ry6b',
        },
      ],
    },
  ],
}

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
    render(<UsernamePage user={user} />)

    expect(screen.queryByText('user1', { selector: 'h1' })).toBeInTheDocument()
    expect(screen.getByText('the greatest stamper')).toBeInTheDocument()
  })
  it('displays no user found', () => {
    render(<UsernamePage user={null} />)

    expect(screen.getByText('User not found')).toBeInTheDocument()
  })
  it('notifies user has no stamps', () => {
    user.listedStamps = []
    render(<UsernamePage user={user} />)

    expect(screen.getByText('user1')).toBeInTheDocument()
    expect(screen.getByText('User has no stamps')).toBeInTheDocument()
  })
})
