import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GoalCard } from './goal-card'

const mockGoal = {
  id: '1',
  title: 'Learn Guitar',
  description: 'Master playing acoustic guitar',
  category: 'Skill',
  priority: 1,
  status: 'in_progress',
  targetDate: '2025-12-31',
  completedAt: null,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
}

describe('GoalCard', () => {
  it('renders goal title', () => {
    render(<GoalCard goal={mockGoal} progress={50} />)
    expect(screen.getByText('Learn Guitar')).toBeInTheDocument()
  })

  it('renders category badge', () => {
    render(<GoalCard goal={mockGoal} progress={50} />)
    expect(screen.getByText('Skill')).toBeInTheDocument()
  })

  it('renders progress bar with correct percentage', () => {
    render(<GoalCard goal={mockGoal} progress={75} />)
    expect(screen.getByText('75%')).toBeInTheDocument()
  })

  it('renders target date when provided', () => {
    render(<GoalCard goal={mockGoal} progress={50} />)
    expect(screen.getByText(/2025/)).toBeInTheDocument()
  })

  it('has link to goal detail page', () => {
    render(<GoalCard goal={mockGoal} progress={50} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/dashboard/bucket-items/1')
  })

  it('applies hover styling', () => {
    render(<GoalCard goal={mockGoal} progress={50} />)
    const card = screen.getByTestId('goal-card')
    expect(card).toHaveClass('hover:shadow-lg')
  })
})
