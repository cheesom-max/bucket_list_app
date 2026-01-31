import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QuoteCard } from './quote-card'

describe('QuoteCard', () => {
  it('renders quote text', () => {
    render(<QuoteCard quote="The journey of a thousand miles begins with a single step." />)
    expect(screen.getByText(/journey of a thousand miles/)).toBeInTheDocument()
  })

  it('renders author when provided', () => {
    render(<QuoteCard quote="Just do it." author="Nike" />)
    expect(screen.getByText(/Nike/)).toBeInTheDocument()
  })

  it('does not show author section when not provided', () => {
    render(<QuoteCard quote="Just do it." />)
    expect(screen.queryByTestId('quote-author')).not.toBeInTheDocument()
  })

  it('has quote icon', () => {
    render(<QuoteCard quote="Test quote" />)
    expect(screen.getByTestId('quote-icon')).toBeInTheDocument()
  })
})
