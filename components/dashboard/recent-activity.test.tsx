import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RecentActivity } from './recent-activity'

const mockActivities = [
  { id: '1', type: 'progress', message: 'Made progress on Learn Guitar', createdAt: '2024-01-15T10:30:00Z' },
  { id: '2', type: 'complete', message: 'Completed Step 1 of Visit Japan', createdAt: '2024-01-14T15:45:00Z' },
]

describe('RecentActivity', () => {
  it('renders section title', () => {
    render(<RecentActivity activities={mockActivities} />)
    expect(screen.getByText(/recent activity/i)).toBeInTheDocument()
  })

  it('renders activity items', () => {
    render(<RecentActivity activities={mockActivities} />)
    expect(screen.getByText(/Made progress on Learn Guitar/)).toBeInTheDocument()
  })

  it('renders empty state when no activities', () => {
    render(<RecentActivity activities={[]} />)
    expect(screen.getByText(/no recent activity/i)).toBeInTheDocument()
  })
})
