import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LeftSidebar } from './left-sidebar'

// Mock usePathname to control active route
vi.mock('next/navigation', async () => {
  const actual = await vi.importActual('next/navigation')
  return {
    ...actual,
    usePathname: () => '/dashboard',
  }
})

describe('LeftSidebar', () => {
  it('renders the logo/brand', () => {
    render(<LeftSidebar />)
    expect(screen.getByText(/bucket/i)).toBeInTheDocument()
  })

  it('renders navigation menu items', () => {
    render(<LeftSidebar />)
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument()
    expect(screen.getByText(/AI Guide/i)).toBeInTheDocument()
  })

  it('highlights the active route', () => {
    render(<LeftSidebar />)
    const dashboardLink = screen.getByRole('link', { name: /Dashboard/i })
    expect(dashboardLink).toHaveClass('bg-sidebar-accent')
  })

  it('renders user profile section at bottom', () => {
    render(<LeftSidebar />)
    expect(screen.getByText(/Test User/i)).toBeInTheDocument()
  })

  it('renders collapsed state when collapsed prop is true', () => {
    render(<LeftSidebar collapsed={true} />)
    const sidebar = screen.getByTestId('left-sidebar')
    expect(sidebar).toHaveClass('w-16')
  })

  it('renders expanded state when collapsed prop is false', () => {
    render(<LeftSidebar collapsed={false} />)
    const sidebar = screen.getByTestId('left-sidebar')
    expect(sidebar).toHaveClass('w-64')
  })
})
