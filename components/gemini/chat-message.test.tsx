import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ChatMessage } from './chat-message'

const userMessage = {
  id: '1',
  role: 'user' as const,
  content: 'Hello AI!',
  createdAt: new Date(),
}

const assistantMessage = {
  id: '2',
  role: 'assistant' as const,
  content: 'Hello! How can I help you today?',
  createdAt: new Date(),
  suggestions: ['Travel ideas', 'Career goals'],
}

describe('ChatMessage', () => {
  it('renders user message content', () => {
    render(<ChatMessage message={userMessage} />)
    expect(screen.getByText('Hello AI!')).toBeInTheDocument()
  })

  it('renders assistant message content', () => {
    render(<ChatMessage message={assistantMessage} />)
    expect(screen.getByText('Hello! How can I help you today?')).toBeInTheDocument()
  })

  it('aligns user messages to the right', () => {
    render(<ChatMessage message={userMessage} />)
    const container = screen.getByTestId('message-container')
    expect(container).toHaveClass('justify-end')
  })

  it('aligns assistant messages to the left', () => {
    render(<ChatMessage message={assistantMessage} />)
    const container = screen.getByTestId('message-container')
    expect(container).toHaveClass('justify-start')
  })

  it('shows avatar for assistant messages', () => {
    render(<ChatMessage message={assistantMessage} />)
    expect(screen.getByTestId('assistant-avatar')).toBeInTheDocument()
  })
})
