import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RightSidebar } from './right-sidebar'

describe('RightSidebar', () => {
  it('renders children content', () => {
    render(
      <RightSidebar>
        <div>Test Content</div>
      </RightSidebar>
    )
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('applies default styling', () => {
    render(
      <RightSidebar>
        <div>Content</div>
      </RightSidebar>
    )
    const sidebar = screen.getByTestId('right-sidebar')
    expect(sidebar).toHaveClass('w-80')
    expect(sidebar).toHaveClass('border-l')
  })

  it('accepts custom className', () => {
    render(
      <RightSidebar className="custom-class">
        <div>Content</div>
      </RightSidebar>
    )
    const sidebar = screen.getByTestId('right-sidebar')
    expect(sidebar).toHaveClass('custom-class')
  })

  it('is hidden on smaller screens by default', () => {
    render(
      <RightSidebar>
        <div>Content</div>
      </RightSidebar>
    )
    const sidebar = screen.getByTestId('right-sidebar')
    expect(sidebar).toHaveClass('hidden')
    expect(sidebar).toHaveClass('xl:flex')
  })
})
