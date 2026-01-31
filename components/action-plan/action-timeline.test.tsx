import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ActionTimeline } from './action-timeline'

const mockSteps = [
  { id: '1', title: 'Step 1', order: 1, isCompleted: true },
  { id: '2', title: 'Step 2', order: 2, isCompleted: false },
  { id: '3', title: 'Step 3', order: 3, isCompleted: false },
]

describe('ActionTimeline', () => {
  it('renders all steps', () => {
    render(<ActionTimeline steps={mockSteps} onStepComplete={() => {}} />)
    expect(screen.getByText('Step 1')).toBeInTheDocument()
    expect(screen.getByText('Step 2')).toBeInTheDocument()
    expect(screen.getByText('Step 3')).toBeInTheDocument()
  })

  it('renders timeline connector line', () => {
    render(<ActionTimeline steps={mockSteps} onStepComplete={() => {}} />)
    expect(screen.getByTestId('timeline-connector')).toBeInTheDocument()
  })

  it('renders empty state when no steps', () => {
    render(<ActionTimeline steps={[]} onStepComplete={() => {}} />)
    expect(screen.getByText(/no action plan/i)).toBeInTheDocument()
  })
})
