import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { UpcomingMilestones } from './upcoming-milestones'

const mockMilestones = [
  { id: '1', title: 'Learn Guitar', targetDate: '2025-03-15' },
  { id: '2', title: 'Visit Japan', targetDate: '2025-06-20' },
]

describe('UpcomingMilestones', () => {
  it('renders section title', () => {
    render(<UpcomingMilestones milestones={mockMilestones} />)
    expect(screen.getByText(/upcoming/i)).toBeInTheDocument()
  })

  it('renders milestone items', () => {
    render(<UpcomingMilestones milestones={mockMilestones} />)
    expect(screen.getByText('Learn Guitar')).toBeInTheDocument()
    expect(screen.getByText('Visit Japan')).toBeInTheDocument()
  })

  it('renders empty state when no milestones', () => {
    render(<UpcomingMilestones milestones={[]} />)
    expect(screen.getByText(/no upcoming/i)).toBeInTheDocument()
  })

  it('shows formatted dates', () => {
    render(<UpcomingMilestones milestones={mockMilestones} />)
    expect(screen.getByText(/Mar/)).toBeInTheDocument()
  })
})
