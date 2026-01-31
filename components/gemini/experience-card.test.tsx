import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ExperienceCard } from './experience-card'

const mockExperience = {
  id: '1',
  title: 'Visit Tokyo',
  description: 'Experience Japanese culture',
  category: 'Travel',
  difficulty: 'medium' as const,
}

describe('ExperienceCard', () => {
  it('renders experience title', () => {
    render(<ExperienceCard experience={mockExperience} onAdd={() => {}} />)
    expect(screen.getByText('Visit Tokyo')).toBeInTheDocument()
  })

  it('renders experience description', () => {
    render(<ExperienceCard experience={mockExperience} onAdd={() => {}} />)
    expect(screen.getByText('Experience Japanese culture')).toBeInTheDocument()
  })

  it('renders category badge', () => {
    render(<ExperienceCard experience={mockExperience} onAdd={() => {}} />)
    expect(screen.getByText('Travel')).toBeInTheDocument()
  })

  it('renders Add to List button', () => {
    render(<ExperienceCard experience={mockExperience} onAdd={() => {}} />)
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument()
  })

  it('calls onAdd when button clicked', () => {
    const mockOnAdd = vi.fn()
    render(<ExperienceCard experience={mockExperience} onAdd={mockOnAdd} />)

    fireEvent.click(screen.getByRole('button', { name: /add/i }))
    expect(mockOnAdd).toHaveBeenCalled()
  })
})
