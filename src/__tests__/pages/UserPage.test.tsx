import Page from '@/pages/[user]'

import { render, screen } from '../test-utils'

const stats = {
  downloads: 10,
  likes: 5,
}
const userStamps = {
  id: 'ihvgpr8glzfuxirznjvhwdl1',
  name: null,
  email: null,
  emailVerified: null,
  image: null,
  username: 'user100',
  usernameURL: 'user100',
  biography: 'user100 amazing stamp creator',
  likedStamps: [],
  listedStamps: [
    {
      id: 'lvlo7zgws578mznet2owlon0',
      userId: 'ihvgpr8glzfuxirznjvhwdl1',
      game: '1800',
      title: 'Stamp-99',
      description: 'Stamp-99',
      category: 'cosmetic',
      region: 'old world',
      imageUrl: null,
      stampFileUrl: '/test-stamp.zip',
      good: null,
      capital: null,
      collection: false,
      createdAt: 1713225892,
      changedAt: 1713225892,
      updatedAt: 1713225892,
      modded: false,
      downloads: 99,
      _count: { likedBy: 2 },
      images: [
        {
          id: 'dhxl6xoa9rdz7dspjv7m5wnu',
          originalUrl:
            'https://placehold.co/2000x2000.png?text=Original1\\ndhxl6xoa9rdz7dspjv7m5wnu',
          thumbnailUrl:
            'https://placehold.co/250x250.png?text=Thumbnail1\\ndhxl6xoa9rdz7dspjv7m5wnu',
          smallUrl:
            'https://placehold.co/500x281.png?text=Small1\\ndhxl6xoa9rdz7dspjv7m5wnu',
          mediumUrl:
            'https://placehold.co/750x421.png?text=Medium1\\ndhxl6xoa9rdz7dspjv7m5wnu',
          largeUrl:
            'https://placehold.co/1024x576.png?text=Large1\\ndhxl6xoa9rdz7dspjv7m5wnu',
          createdAt: 1713225892,
          updatedAt: 1713225892,
          stampId: 'lvlo7zgws578mznet2owlon0',
        },
      ],
    },
  ],
}

describe('UserPage', () => {
  it('renders public user view with stamps', () => {
    render(<Page user={userStamps} stats={stats} />)

    expect(screen.getByRole('heading', { name: 'user100' })).toBeInTheDocument()
    expect(
      screen.getByText('user100 amazing stamp creator')
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Stamp-99' })
    ).toBeInTheDocument()
  })

  it('renders public user view without stamps', () => {
    render(<Page user={{ ...userStamps, listedStamps: [] }} stats={stats} />)

    expect(screen.getByText('user100')).toBeInTheDocument()
    expect(screen.getByText('User has no stamps')).toBeInTheDocument()
  })
  it('renders empty state for user home view without stamps', () => {
    render(<Page user={{ ...userStamps, listedStamps: [] }} stats={stats} />, {
      expires: new Date(Date.now() + 2 * 86400).toISOString(),
      user: userStamps,
    })

    expect(
      screen.getByText('Get started by creating a new stamp.')
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'New Stamp' })).toHaveAttribute(
      'href',
      '/user/create'
    )
  })
  it('renders stamps with edit stamp options for user home view', () => {
    render(<Page user={userStamps} stats={stats} />, {
      expires: new Date(Date.now() + 2 * 86400).toISOString(),
      user: userStamps,
    })

    expect(screen.getByTestId('delete-stamp')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Edit Stamp' })).toHaveAttribute(
      'href',
      '/user/lvlo7zgws578mznet2owlon0'
    )
  })
})
