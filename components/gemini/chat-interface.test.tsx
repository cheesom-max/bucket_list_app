import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ChatInterface } from './chat-interface'
import { useChatStore } from '@/lib/stores/chat-store'

// Mock the store
vi.mock('@/lib/stores/chat-store', () => ({
  useChatStore: vi.fn(),
}))

// Mock the query client
vi.mock('@tanstack/react-query', () => ({
  useMutation: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}))

describe('ChatInterface', () => {
  beforeEach(() => {
    vi.mocked(useChatStore).mockReturnValue({
      messages: [],
      isTyping: false,
      addMessage: vi.fn(),
      setTyping: vi.fn(),
      clearMessages: vi.fn(),
    })
  })

  it('renders chat header', () => {
    render(<ChatInterface />)
    expect(screen.getByText(/AI Guide/i)).toBeInTheDocument()
  })

  it('renders chat input area', () => {
    render(<ChatInterface />)
    expect(screen.getByPlaceholderText(/message/i)).toBeInTheDocument()
  })

  it('renders welcome message when no messages', () => {
    render(<ChatInterface />)
    expect(screen.getByText(/help you discover/i)).toBeInTheDocument()
  })

  it('renders messages when available', () => {
    vi.mocked(useChatStore).mockReturnValue({
      messages: [
        { id: '1', role: 'user', content: 'Hello', createdAt: new Date() },
        { id: '2', role: 'assistant', content: 'Hi there!', createdAt: new Date() },
      ],
      isTyping: false,
      addMessage: vi.fn(),
      setTyping: vi.fn(),
      clearMessages: vi.fn(),
    })

    render(<ChatInterface />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
    expect(screen.getByText('Hi there!')).toBeInTheDocument()
  })
})
