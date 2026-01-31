import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TimelineStep } from './timeline-step'

const mockStep = {
  id: '1',
  title: 'Learn Hiragana',
  description: 'Master the first Japanese alphabet',
  order: 1,
  estimatedDuration: '2 weeks',
  isCompleted: false,
}

describe('TimelineStep', () => {
  it('renders step title', () => {
    render(<TimelineStep step={mockStep} status="pending" onComplete={() => {}} />)
    expect(screen.getByText('Learn Hiragana')).toBeInTheDocument()
  })

  it('renders step description', () => {
    render(<TimelineStep step={mockStep} status="pending" onComplete={() => {}} />)
    expect(screen.getByText('Master the first Japanese alphabet')).toBeInTheDocument()
  })

  it('renders estimated duration', () => {
    render(<TimelineStep step={mockStep} status="pending" onComplete={() => {}} />)
    expect(screen.getByText(/2 weeks/)).toBeInTheDocument()
  })

  it('shows completed styling when status is completed', () => {
    render(
      <TimelineStep
        step={{ ...mockStep, isCompleted: true }}
        status="completed"
        onComplete={() => {}}
      />
    )
    expect(screen.getByTestId('step-indicator')).toHaveClass('bg-green-500')
  })

  it('shows in-progress styling when status is in_progress', () => {
    render(<TimelineStep step={mockStep} status="in_progress" onComplete={() => {}} />)
    expect(screen.getByTestId('step-indicator')).toHaveClass('bg-blue-500')
  })

  it('calls onComplete when checkbox clicked', () => {
    const mockOnComplete = vi.fn()
    render(<TimelineStep step={mockStep} status="pending" onComplete={mockOnComplete} />)

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    expect(mockOnComplete).toHaveBeenCalled()
  })
})
