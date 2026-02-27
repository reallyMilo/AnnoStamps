import { usePathname } from 'next/navigation'
import { type Mock } from 'vitest'

import { fireEvent, render, screen } from '@/__tests__/test-utils'

import { VersionButtons } from '../VersionButtons'

describe('VersionButtons', () => {
  it('renders with root path "/"', () => {
    ;(usePathname as Mock).mockReturnValue('/')
    render(<VersionButtons />)
    const link117 = screen.getByTestId('default-version-link')
    const link1800 = screen.getByTestId('1800-version-link')

    expect(link117).toHaveAttribute('href', '/')
    expect(link1800).toHaveAttribute('href', '/1800')
    expect(link117.className).toMatch(/bg-secondary/)
    expect(link1800.className).not.toMatch(/bg-secondary/)
  })

  it('renders duplicate route (e.g., /stamps)', () => {
    ;(usePathname as Mock).mockReturnValue('/stamps')

    render(<VersionButtons />)
    const link117 = screen.getByTestId('default-version-link')
    const link1800 = screen.getByTestId('1800-version-link')

    expect(link117).toHaveAttribute('href', '/stamps')
    expect(link1800).toHaveAttribute('href', '/1800/stamps')
    expect(link117.className).toMatch(/bg-secondary/)
  })

  it('renders version route /1800/... correctly', () => {
    ;(usePathname as Mock).mockReturnValue('/1800/stamps')

    render(<VersionButtons />)
    const link117 = screen.getByTestId('default-version-link')
    const link1800 = screen.getByTestId('1800-version-link')

    expect(link117).toHaveAttribute('href', '/stamps')
    expect(link1800).toHaveAttribute('href', '/1800/stamps')
    expect(link1800.className).toMatch(/bg-secondary/)
  })

  it('renders user route containing "1800" in path', () => {
    ;(usePathname as Mock).mockReturnValue('/user/1800')

    render(<VersionButtons />)
    const link117 = screen.getByTestId('default-version-link')
    const link1800 = screen.getByTestId('1800-version-link')

    expect(link117).toHaveAttribute('href', '/user')
    expect(link1800).toHaveAttribute('href', '/user/1800')
    expect(link1800.className).toMatch(/bg-secondary/)
  })

  it('renders other route not matching duplicates or version route', () => {
    ;(usePathname as Mock).mockReturnValue('/user/nothing')

    render(<VersionButtons />)
    const link117 = screen.getByTestId('default-version-link')
    const link1800 = screen.getByTestId('1800-version-link')

    expect(link117).toHaveAttribute('href', '/user')
    expect(link1800).toHaveAttribute('href', '/user/1800')
    expect(link117.className).toMatch(/bg-secondary/)
  })

  it('shows version switching info panel when updates button is clicked', () => {
    ;(usePathname as Mock).mockReturnValue('/')

    render(<VersionButtons />)
    const toggle = screen.getByTestId('version-info-toggle')

    expect(
      screen.queryByText('Version Switching Is Live'),
    ).not.toBeInTheDocument()
    fireEvent.click(toggle)
    expect(screen.getByText('Version Switching Is Live')).toBeInTheDocument()
  })

  it('highlights 117 button when hovering 117 info card', () => {
    ;(usePathname as Mock).mockReturnValue('/1800/stamps')

    render(<VersionButtons />)
    fireEvent.click(screen.getByTestId('version-info-toggle'))

    const link117 = screen.getByTestId('default-version-link')
    const info117 = screen.getByTestId('version-117-info')

    expect(link117.className).not.toMatch(/bg-secondary/)
    fireEvent.mouseEnter(info117)
    expect(link117.className).toMatch(/bg-secondary/)
    fireEvent.mouseLeave(info117)
    expect(link117.className).not.toMatch(/bg-secondary/)
  })

  it('highlights 1800 button when hovering 1800 info card', () => {
    ;(usePathname as Mock).mockReturnValue('/stamps')

    render(<VersionButtons />)
    fireEvent.click(screen.getByTestId('version-info-toggle'))

    const link1800 = screen.getByTestId('1800-version-link')
    const info1800 = screen.getByTestId('version-1800-info')

    expect(link1800.className).not.toMatch(/bg-secondary/)
    fireEvent.mouseEnter(info1800)
    expect(link1800.className).toMatch(/bg-secondary/)
    fireEvent.mouseLeave(info1800)
    expect(link1800.className).not.toMatch(/bg-secondary/)
  })
})
