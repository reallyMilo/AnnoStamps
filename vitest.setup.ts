import '@testing-library/jest-dom'

import { beforeAll, vi } from 'vitest'
const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

vi.stubGlobal('ResizeObserver', ResizeObserverMock)
beforeAll(() => {
  vi.mock('next/router', () => require('next-router-mock'))
})
