import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MediaJournal } from './media-journal'

const mockMedia = [
  { id: '1', url: '/image1.jpg', type: 'image', caption: 'Day 1', createdAt: '2024-01-01' },
  { id: '2', url: '/image2.jpg', type: 'image', caption: 'Week 2', createdAt: '2024-01-15' },
]

describe('MediaJournal', () => {
  it('renders section title', () => {
    render(<MediaJournal media={mockMedia} onUpload={() => {}} />)
    expect(screen.getByText(/journal/i)).toBeInTheDocument()
  })

  it('renders media grid', () => {
    render(<MediaJournal media={mockMedia} onUpload={() => {}} />)
    expect(screen.getByTestId('media-grid')).toBeInTheDocument()
  })

  it('renders upload button', () => {
    render(<MediaJournal media={mockMedia} onUpload={() => {}} />)
    expect(screen.getByRole('button', { name: /upload/i })).toBeInTheDocument()
  })

  it('renders empty state when no media', () => {
    render(<MediaJournal media={[]} onUpload={() => {}} />)
    expect(screen.getByText(/no photos/i)).toBeInTheDocument()
  })
})
