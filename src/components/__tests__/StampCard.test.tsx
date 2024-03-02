import { StampWithRelations } from '@/lib/prisma/queries'

import {
  render as renderRTL,
  screen,
  userEvent,
} from '../../__tests__/test-utils'
import StampCard from '../StampCard'

const render = (props?: Partial<StampWithRelations>) => ({
  ...renderRTL(
    <StampCard
      id="urlID"
      title="Stamp Title"
      category="production"
      region="old world"
      imageUrl={null}
      downloads={123}
      createdAt={1709335430}
      updatedAt={1709397580}
      modded
      user={{ username: 'stampCreator' } as StampWithRelations['user']}
      likedBy={[{ id: '10' }, { id: '11' }] as StampWithRelations['likedBy']}
      images={[] as StampWithRelations['images']}
      {...props}
    />
  ),
  user: userEvent.setup(),
})

describe('Stamp Card', () => {
  it('renders with all provided props', () => {
    render()

    expect(screen.getByTestId('stamp-card-link')).toHaveAttribute(
      'href',
      '/stamp/urlID'
    )
    expect(screen.getByAltText('Stamp Title')).toBeInTheDocument()
    expect(screen.getByText('mods')).toBeInTheDocument()
    expect(screen.getByText('123')).toBeInTheDocument()
    expect(screen.getByText('production')).toBeInTheDocument()
    expect(screen.getByText('old world')).toBeInTheDocument()
    expect(screen.getByText('stampCreator')).toBeInTheDocument()
    expect(screen.getByText('20 hours ago'))
  })

  it('hidden mod when false', () => {
    render({ modded: false })
    expect(screen.queryByText('mods')).not.toBeInTheDocument()
  })
})
