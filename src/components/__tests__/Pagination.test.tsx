import { render, screen } from '@testing-library/react'

import { Pagination } from '../Pagination'
describe('Pagination', () => {
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
  it('renders with provided props', () => {
    render(<Pagination count={3000} />)

    expect(screen.getByText('3000')).toBeInTheDocument()
    expect(screen.getByText('19')).toBeInTheDocument()
  })
})
