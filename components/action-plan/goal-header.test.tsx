import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GoalHeader } from './goal-header'

const mockGoal = {
  id: '1',
  title: 'Learn Japanese',
  description: 'Master conversational Japanese',
  category: 'Skill',
  priority: 1,
  status: 'in_progress',
  targetDate: '2025-12-31',
  completedAt: null,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
}

describe('GoalHeader', () => {
  it('renders goal title', () => {
    render(<GoalHeader goal={mockGoal} progress={50} />)
    expect(screen.getByText('Learn Japanese')).toBeInTheDocument()
  })

  it('renders progress percentage', () => {
    render(<GoalHeader goal={mockGoal} progress={75} />)
    expect(screen.getByText('75%')).toBeInTheDocument()
  })

  it('renders target date', () => {
    render(<GoalHeader goal={mockGoal} progress={50} />)
    expect(screen.getByText(/2025/)).toBeInTheDocument()
  })

  it('renders status badge', () => {
    render(<GoalHeader goal={mockGoal} progress={50} />)
    expect(screen.getByTestId('status-badge')).toBeInTheDocument()
  })

  it('renders large progress bar', () => {
    render(<GoalHeader goal={mockGoal} progress={50} />)
    expect(screen.getByTestId('progress-bar')).toBeInTheDocument()
  })
})
