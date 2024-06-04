import type { StampWithRelations } from '@/lib/prisma/queries'
import StampPage from '@/pages/stamp/[id]'

import { render as renderRTL, screen, userEvent } from '../../test-utils'

const stamp = {
  id: 'clmsefb5m00ujk9xxenynap1z',
  userId: 'clmsefb46002rk9xxdwbuimjn',
  game: '1800',
  title: 'Stamp-Calamari-999',
  description: 'My greatest Stamp',
  category: 'production',
  region: 'new world',
  stampFileUrl: '/stamp.zip',
  good: 'calamari',
  collection: true,
  capital: null,
  createdAt: 1695253939,
  changedAt: 1695253939,
  updatedAt: 1695253939,
  modded: true,
  downloads: 999,
  user: {
    image: null,
    username: 'user100',
    usernameURL: 'user100',
  },
  _count: {
    likedBy: 1,
  },
  images: [
    {
      id: 'clmsefbny02bok9xx8vcct39s',
      originalUrl:
        'https://placehold.co/2000x2000.png?text=Original1\\nclmsefb5m00ujk9xxenynap1z',
      thumbnailUrl:
        'https://placehold.co/250x250.png?text=Thumbnail1\\nclmsefb5m00ujk9xxenynap1z',
      smallUrl:
        'https://placehold.co/500x500.png?text=Small1\\nclmsefb5m00ujk9xxenynap1z',
      mediumUrl:
        'https://placehold.co/750x750.png?text=Medium1\\nclmsefb5m00ujk9xxenynap1z',
      largeUrl:
        'https://placehold.ca/1000x1000.png?text=Large1\\nclmsefb5m00ujk9xxenynap1z',
      createdAt: 1695253939,
      updatedAt: 1695253939,
      stampId: 'clmsefb5m00ujk9xxenynap1z',
    },
  ],
} satisfies StampWithRelations
const render = (props?: Partial<StampWithRelations>) => ({
  ...renderRTL(<StampPage stamp={{ ...stamp, ...props }} />),
  user: userEvent.setup(),
})

describe('Stamp Page', () => {
  it('renders with all provided fields', () => {
    render()

    expect(screen.getByText('Stamp-Calamari-999')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'user100' })).toBeInTheDocument()
    expect(screen.getByText('My greatest Stamp')).toBeInTheDocument()
    expect(screen.getByText('production')).toBeInTheDocument()
    expect(screen.getByText('new world')).toBeInTheDocument()
    expect(screen.getByText('calamari')).toBeInTheDocument()
    expect(screen.getByText('mods')).toBeInTheDocument()
    expect(screen.getByText('Collection')).toBeInTheDocument()
    expect(screen.getByText('999')).toBeInTheDocument()
    expect(screen.getByRole('img')).toBeInTheDocument()
    expect(screen.getByText('ago', { exact: false })).toBeInTheDocument()
  })
  it('does not display false props', () => {
    render({
      collection: false,
      modded: false,
    })
    expect(screen.queryByText('mods')).not.toBeInTheDocument()
    expect(screen.queryByText('collection')).not.toBeInTheDocument()
  })
  it('displays stamp updated time', () => {
    render({
      changedAt: 1709404300,
    })

    expect(screen.getByText('Updated:', { exact: false })).toBeInTheDocument()
  })
  it('renders markdown text', () => {
    render({
      description: `## Heading\n\n[TheBestMod](mod.io)`,
    })
    expect(screen.getByRole('link', { name: 'TheBestMod' })).toHaveProperty(
      'href',
      'https://mod.io/'
    )
  })
})
