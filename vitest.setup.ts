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
    useRouter: vi.fn(() => ({
      prefetch: vi.fn(),
      push: vi.fn(),
      replace: vi.fn(),
    })),
    useSearchParams: vi.fn(() => new URLSearchParams()),
  }))
  vi.mock('better-auth/react', () => ({
    createAuthClient: vi.fn(() => ({
      signIn: vi.fn(),
      signOut: vi.fn(),
      useSession: vi.fn(),
    })),
  }))
})
