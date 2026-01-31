import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ActiveGoalsGrid } from './active-goals-grid'

const mockGoals = [
  {
    id: '1',
    title: 'Learn Guitar',
    description: 'Master playing acoustic guitar',
    category: 'Skill',
    priority: 1,
    status: 'in_progress',
    targetDate: '2025-12-31',
    completedAt: null,
    progress: [{ percentage: 50 }],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '2',
    title: 'Visit Japan',
    description: 'Travel to Tokyo and Kyoto',
    category: 'Travel',
    priority: 2,
    status: 'planned',
    targetDate: '2025-06-15',
    completedAt: null,
    progress: [{ percentage: 25 }],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
]

describe('ActiveGoalsGrid', () => {
  it('renders goal cards for each goal', () => {
    render(<ActiveGoalsGrid goals={mockGoals} isLoading={false} />)
    expect(screen.getByText('Learn Guitar')).toBeInTheDocument()
    expect(screen.getByText('Visit Japan')).toBeInTheDocument()
  })

  it('renders loading skeleton when isLoading is true', () => {
    render(<ActiveGoalsGrid goals={[]} isLoading={true} />)
    const skeletons = screen.getAllByTestId('goal-card-skeleton')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('renders empty state when no goals', () => {
    render(<ActiveGoalsGrid goals={[]} isLoading={false} />)
    expect(screen.getByText(/no active goals/i)).toBeInTheDocument()
  })

  it('has responsive grid layout', () => {
    render(<ActiveGoalsGrid goals={mockGoals} isLoading={false} />)
    const grid = screen.getByTestId('goals-grid')
    expect(grid).toHaveClass('grid')
    expect(grid).toHaveClass('md:grid-cols-2')
  })
})
