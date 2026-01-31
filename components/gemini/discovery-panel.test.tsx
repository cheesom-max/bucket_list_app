import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DiscoveryPanel } from './discovery-panel'

const mockExperiences = [
  {
    id: '1',
    title: 'Visit Tokyo',
    description: 'Experience Japanese culture',
    category: 'Travel',
  },
  {
    id: '2',
    title: 'Learn Piano',
    description: 'Master the piano',
    category: 'Skill',
  },
]

describe('DiscoveryPanel', () => {
  it('renders section title', () => {
    render(<DiscoveryPanel experiences={mockExperiences} onSelect={() => {}} />)
    expect(screen.getByText(/discover/i)).toBeInTheDocument()
  })

  it('renders experience cards', () => {
    render(<DiscoveryPanel experiences={mockExperiences} onSelect={() => {}} />)
    expect(screen.getByText('Visit Tokyo')).toBeInTheDocument()
    expect(screen.getByText('Learn Piano')).toBeInTheDocument()
  })

  it('renders empty state when no experiences', () => {
    render(<DiscoveryPanel experiences={[]} onSelect={() => {}} />)
    expect(screen.getByText(/no suggestions/i)).toBeInTheDocument()
  })
})
