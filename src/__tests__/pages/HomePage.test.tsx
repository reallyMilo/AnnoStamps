import type { StampWithRelations } from '@/lib/prisma/queries'
import HomePage from '@/pages'

import { render, screen } from '../test-utils'

const stamps = [
  {
    id: 'clmsefb5m00ujk9xxenynap1z',
    createdAt: 1695253939,
    changedAt: 1695253939,
    user: {
      username: 'user100',
    },
    images: [],
  },
] as unknown as StampWithRelations[]

describe('Home Page', () => {
  it('render HomePage with filter and without stamps', () => {
    render(<HomePage count={0} stamps={[]} pageNumber={1} />)

    expect(screen.getByLabelText('Category')).toBeInTheDocument()
    expect(screen.getByText('No stamps found.')).toBeInTheDocument()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it('displays pagination and stamps on HomePage', () => {
    render(<HomePage count={22} stamps={stamps} pageNumber={1} />)

    expect(screen.getByText('user100')).toBeInTheDocument()
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })
})
