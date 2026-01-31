import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// Mock scrollIntoView (not available in jsdom)
Element.prototype.scrollIntoView = vi.fn()

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '/dashboard',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock next-auth/react
vi.mock('next-auth/react', () => ({
  useSession: () => ({
    data: {
      user: {
        id: 'test-user-id',
        name: 'Test User',
        email: 'test@example.com',
      },
    },
    status: 'authenticated',
  }),
  signOut: vi.fn(),
}))
