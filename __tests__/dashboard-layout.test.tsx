import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

// Mock the layout component
vi.mock('next/navigation', async () => {
  const actual = await vi.importActual('next/navigation')
  return {
    ...actual,
    usePathname: () => '/dashboard',
  }
})

// We need to import the actual components
import { LeftSidebar } from '@/components/layout/left-sidebar'
import { RightSidebar } from '@/components/layout/right-sidebar'

describe('Dashboard Layout Components', () => {
  it('LeftSidebar and RightSidebar can be rendered together', () => {
    render(
      <div className="flex h-screen">
        <LeftSidebar />
        <main className="flex-1">Main Content</main>
        <RightSidebar>
          <div>Right Content</div>
        </RightSidebar>
      </div>
    )

    expect(screen.getByTestId('left-sidebar')).toBeInTheDocument()
    expect(screen.getByText('Main Content')).toBeInTheDocument()
    expect(screen.getByTestId('right-sidebar')).toBeInTheDocument()
  })

  it('LeftSidebar has correct width', () => {
    render(<LeftSidebar />)
    const sidebar = screen.getByTestId('left-sidebar')
    expect(sidebar).toHaveClass('w-64')
  })

  it('RightSidebar has correct width', () => {
    render(
      <RightSidebar>
        <div>Content</div>
      </RightSidebar>
    )
    const sidebar = screen.getByTestId('right-sidebar')
    expect(sidebar).toHaveClass('w-80')
  })
})
