import { usePathname } from 'next/navigation'
import { type Mock } from 'vitest'

import { render, screen } from '@/__tests__/test-utils'

import { VersionButtons } from '../VersionButtons'
/* eslint-disable no-extra-semi */
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
})
