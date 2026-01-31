import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HeaderSection } from './header-section'

describe('HeaderSection', () => {
  it('renders user name in greeting', () => {
    render(<HeaderSection userName="John" />)
    expect(screen.getByText(/John/)).toBeInTheDocument()
  })

  it('renders New Goal button', () => {
    render(<HeaderSection userName="John" />)
    expect(screen.getByRole('button', { name: /new goal/i })).toBeInTheDocument()
  })

  it('renders time-based greeting', () => {
    render(<HeaderSection userName="John" />)
    // Should have some form of greeting
    const greetingElement = screen.getByTestId('greeting')
    expect(greetingElement).toBeInTheDocument()
  })
})
