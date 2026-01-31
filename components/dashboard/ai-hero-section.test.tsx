import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AIHeroSection } from './ai-hero-section'

describe('AIHeroSection', () => {
  it('renders AI recommendation card', () => {
    render(<AIHeroSection onExplore={() => {}} />)
    expect(screen.getByText('AI Recommendation')).toBeInTheDocument()
  })

  it('renders suggestion title when provided', () => {
    render(
      <AIHeroSection
        suggestion={{ title: 'Learn Photography', description: 'Capture beautiful moments' }}
        onExplore={() => {}}
      />
    )
    expect(screen.getByText('Learn Photography')).toBeInTheDocument()
    expect(screen.getByText('Capture beautiful moments')).toBeInTheDocument()
  })

  it('renders Explore with AI button', () => {
    render(<AIHeroSection onExplore={() => {}} />)
    expect(screen.getByRole('button', { name: /explore/i })).toBeInTheDocument()
  })

  it('calls onExplore when button is clicked', () => {
    const mockOnExplore = vi.fn()
    render(<AIHeroSection onExplore={mockOnExplore} />)

    const button = screen.getByRole('button', { name: /explore/i })
    fireEvent.click(button)

    expect(mockOnExplore).toHaveBeenCalledTimes(1)
  })

  it('has gradient background styling', () => {
    render(<AIHeroSection onExplore={() => {}} />)
    const card = screen.getByTestId('ai-hero-card')
    expect(card).toHaveClass('bg-gradient-to-r')
  })
})
