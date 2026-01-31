import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { GeminiTipCard } from './gemini-tip-card'

describe('GeminiTipCard', () => {
  it('renders tip content', () => {
    render(<GeminiTipCard tip="Practice daily for best results" onRefresh={() => {}} />)
    expect(screen.getByText('Practice daily for best results')).toBeInTheDocument()
  })

  it('renders Gemini branding', () => {
    render(<GeminiTipCard tip="Test tip" onRefresh={() => {}} />)
    expect(screen.getByText('AI Tip')).toBeInTheDocument()
  })

  it('renders refresh button', () => {
    render(<GeminiTipCard tip="Test tip" onRefresh={() => {}} />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('calls onRefresh when refresh button clicked', () => {
    const mockOnRefresh = vi.fn()
    render(<GeminiTipCard tip="Test tip" onRefresh={mockOnRefresh} />)

    fireEvent.click(screen.getByRole('button'))
    expect(mockOnRefresh).toHaveBeenCalled()
  })
})
