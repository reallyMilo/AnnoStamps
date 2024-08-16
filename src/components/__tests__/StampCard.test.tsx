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
      _count={12}
      category="production"
      createdAt="12 days ago"
      downloads={123}
      id="urlID"
      images={[
        {
          createdAt: 1713225892,
          id: 'dhxl6xoa9rdz7dspjv7m5wnu',
          largeUrl:
            'https://placehold.co/1024x576.png?text=Large1\\ndhxl6xoa9rdz7dspjv7m5wnu',
          mediumUrl:
            'https://placehold.co/750x421.png?text=Medium1\\ndhxl6xoa9rdz7dspjv7m5wnu',
          originalUrl:
            'https://placehold.co/2000x2000.png?text=Original1\\ndhxl6xoa9rdz7dspjv7m5wnu',
          smallUrl:
            'https://placehold.co/500x281.png?text=Small1\\ndhxl6xoa9rdz7dspjv7m5wnu',
          stampId: 'urlID',
          thumbnailUrl:
            'https://placehold.co/250x250.png?text=Thumbnail1\\ndhxl6xoa9rdz7dspjv7m5wnu',
          updatedAt: 1713225892,
        },
      ]}
      modded
      region="old world"
      suffixDownloads="123"
      title="Stamp Title"
      updatedAt="12 days ago"
      user={{ username: 'stampCreator' } as StampWithRelations['user']}
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
