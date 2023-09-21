import { render, screen } from '@testing-library/react'

import { stampsMock } from '@/__mocks__/data'
import HomePage from '@/pages'

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
    render(<HomePage count={0} stamps={[]} />)

    expect(screen.getByLabelText('Category')).toBeInTheDocument()
    expect(screen.getByText('No stamps found.')).toBeInTheDocument()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it('displays pagination and stamps on HomePage', () => {
    render(<HomePage count={22} stamps={stampsMock} />)

    expect(screen.getByText('user100')).toBeInTheDocument()
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })
})
