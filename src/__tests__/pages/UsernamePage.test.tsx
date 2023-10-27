import UsernamePage from '@/pages/[username]'

import { render, screen } from '../test-utils'

const userStamp = {
  id: 'clmsefb2r0000k9xxwsnklpvm',
  name: 'User 1',
  email: null,
  emailVerified: null,
  image: null,
  username: 'user1',
  usernameURL: 'user1',
  biography: 'user1 amazing stamp creator',
  discord: 'user1',
  reddit: 'user1',
  emailContact: null,
  twitch: 'user1',
  twitter: 'user1',
  listedStamps: [
    {
      id: 'clmsefb56002sk9xx1b58g39b',
      userId: 'clmsefb2r0000k9xxwsnklpvm',
      game: '1800',
      title: 'Stamp-Wood-0',
      description: 'Stamp-Wood-0',
      category: 'production',
      region: 'old world',
      imageUrl: '/header.jpg',
      stampFileUrl: '/stamp.zip',
      goodCategory: 'raw material',
      good: 'wood',
      population: null,
      capital: null,
      collection: true,
      townhall: true,
      tradeUnion: false,
      createdAt: 1695253939,
      updatedAt: 1695253939,
      modded: false,
      downloads: 0,
      likedBy: [
        {
          id: 'clmsefb3b0011k9xxozt1h0kt',
          name: 'User 38',
          email: null,
          emailVerified: null,
          image: null,
          username: 'user38',
          usernameURL: 'user38',
          biography: 'user38 amazing stamp creator',
          discord: 'user38',
          reddit: 'user38',
          emailContact: null,
          twitch: 'user38',
          twitter: 'user38',
        },
      ],
      images: [
        {
          id: 'clmsefba200ukk9xxvjtgq4og',
          originalUrl:
            'https://placehold.co/2000x2000.png?text=Original1\\nclmsefb56002sk9xx1b58g39b',
          thumbnailUrl:
            'https://placehold.co/250x250.png?text=Thumbnail1\\nclmsefb56002sk9xx1b58g39b',
          smallUrl:
            'https://placehold.co/500x500.png?text=Small1\\nclmsefb56002sk9xx1b58g39b',
          mediumUrl:
            'https://placehold.co/750x750.png?text=Medium1\\nclmsefb56002sk9xx1b58g39b',
          largeUrl:
            'https://placehold.ca/1000x1000.png?text=Large1\\nclmsefb56002sk9xx1b58g39b',
          createdAt: 1695253939,
          updatedAt: 1695253939,
          stampId: 'clmsefb56002sk9xx1b58g39b',
        },
      ],
    },
  ],
}
describe('UsernamePage', () => {
  it('renders and all provided fields', () => {
    render(<UsernamePage user={userStamp} />)

    expect(screen.queryByText('user1', { selector: 'h1' })).toBeInTheDocument()
    expect(screen.getByText('user1 amazing stamp creator')).toBeInTheDocument()
  })
  it('displays no user found', () => {
    render(<UsernamePage user={null} />)

    expect(screen.getByText('User not found')).toBeInTheDocument()
  })
  it('notifies user has no stamps', () => {
    userStamp.listedStamps = []
    render(<UsernamePage user={userStamp} />)

    expect(screen.getByText('user1')).toBeInTheDocument()
    expect(screen.getByText('User has no stamps')).toBeInTheDocument()
  })
})
