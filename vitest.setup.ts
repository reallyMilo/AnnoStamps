import '@testing-library/jest-dom'
import { beforeAll, vi } from 'vitest'
const ResizeObserverMock = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  unobserve: vi.fn(),
}))

vi.stubGlobal('ResizeObserver', ResizeObserverMock)
beforeAll(() => {
  vi.mock('next/navigation', () => ({
    usePathname: vi.fn(() => ''),
    useRouter() {
      return {
        prefetch: () => null,
      }
    },
    useSearchParams() {
      return {}
    },
  }))
})
