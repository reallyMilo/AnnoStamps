import { StampWithRelations } from '@/lib/prisma/models'

import {
  render as renderRTL,
  screen,
  userEvent,
} from '../../__tests__/test-utils'
import { StampCard } from '../StampCard'

const render = (props?: Partial<StampWithRelations>) => ({
  ...renderRTL(
    <StampCard
      id="urlID"
      title="Stamp Title"
      category="production"
      region="old world"
      downloads={123}
      createdAt={1709335430}
      updatedAt={1709397567}
      modded
      user={{ username: 'stampCreator' } as StampWithRelations['user']}
      likedBy={[{ id: '10' }, { id: '11' }] as StampWithRelations['likedBy']}
      images={[
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
          stampId: 'urlID',
        },
      ]}
      {...props}
    />,
  ),
  user: userEvent.setup(),
})

describe('Stamp Card', () => {
  it('renders with all provided props', () => {
    render()

    expect(screen.getByTestId('stamp-card-link')).toHaveAttribute(
      'href',
      '/stamp/urlID',
    )
    expect(screen.getByAltText('Stamp Title')).toBeInTheDocument()
    expect(screen.getByText('mods')).toBeInTheDocument()
    expect(screen.getByText('123')).toBeInTheDocument()
    expect(screen.getByText('production')).toBeInTheDocument()
    expect(screen.getByText('old world')).toBeInTheDocument()
    expect(screen.getByText('stampCreator')).toBeInTheDocument()
    expect(screen.getByText('ago', { exact: false })).toBeInTheDocument()
  })

  it('hidden mod when false', () => {
    render({ modded: false })
    expect(screen.queryByText('mods')).not.toBeInTheDocument()
  })
})
