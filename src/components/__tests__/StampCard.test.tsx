import userEvent from '@testing-library/user-event'

import { stampMock } from '@/__mocks__/data'
import { StampWithRelations } from '@/lib/prisma/queries'

import { render as renderRTL, screen } from '../../__tests__/test-utils'
import StampCard from '../StampCard'

const stamp = stampMock[0]

const render = (props?: Partial<StampWithRelations>) => ({
  ...renderRTL(<StampCard {...stamp} {...props} />),
  user: userEvent.setup(),
})

describe('Stamp Card', () => {
  it('renders with all provided props', () => {
    render({
      id: 'urlID',
      title: 'Stamp Title',
      category: 'production',
      region: 'old world',
      modded: true,
      user: { ...stamp.user, username: 'stampCreator' },
      likedBy: [{ ...stamp.likedBy[0] }, { ...stamp.likedBy[0] }],
    })

    expect(screen.getByTestId('stamp-card-link')).toHaveAttribute(
      'href',
      '/stamp/urlID'
    )
    expect(screen.getByAltText('Stamp Title')).toBeInTheDocument()
    expect(screen.getByText('mods')).toBeInTheDocument()
    expect(screen.getByText('Collection')).toBeInTheDocument()
    expect(screen.getByText('production')).toBeInTheDocument()
    expect(screen.getByText('old world')).toBeInTheDocument()
    expect(screen.getByText('stampCreator')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('hidden mod and collection badge when false', () => {
    render({ modded: false, collection: false })

    expect(screen.queryByText('mods')).not.toBeInTheDocument()
    expect(screen.queryByText('collection')).not.toBeInTheDocument()
  })
})
