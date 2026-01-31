import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ResourcesCard } from './resources-card'

const mockResources = [
  { type: 'cost' as const, label: 'Budget', value: '$500' },
  { type: 'time' as const, label: 'Duration', value: '6 months' },
  { type: 'material' as const, label: 'Equipment', value: 'Textbooks, App' },
]

describe('ResourcesCard', () => {
  it('renders section title', () => {
    render(<ResourcesCard resources={mockResources} />)
    expect(screen.getByText(/resources/i)).toBeInTheDocument()
  })

  it('renders resource items', () => {
    render(<ResourcesCard resources={mockResources} />)
    expect(screen.getByText('$500')).toBeInTheDocument()
    expect(screen.getByText('6 months')).toBeInTheDocument()
  })

  it('renders empty state when no resources', () => {
    render(<ResourcesCard resources={[]} />)
    expect(screen.getByText(/no resources/i)).toBeInTheDocument()
  })
})
