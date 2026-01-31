import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChatInput } from './chat-input'

describe('ChatInput', () => {
  it('renders input field', () => {
    render(<ChatInput onSend={() => {}} isLoading={false} />)
    expect(screen.getByPlaceholderText(/message/i)).toBeInTheDocument()
  })

  it('renders send button', () => {
    render(<ChatInput onSend={() => {}} isLoading={false} />)
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument()
  })

  it('calls onSend with message when send button is clicked', async () => {
    const mockOnSend = vi.fn()
    const user = userEvent.setup()

    render(<ChatInput onSend={mockOnSend} isLoading={false} />)

    const input = screen.getByPlaceholderText(/message/i)
    await user.type(input, 'Hello')

    const sendButton = screen.getByRole('button', { name: /send/i })
    await user.click(sendButton)

    expect(mockOnSend).toHaveBeenCalledWith('Hello')
  })

  it('disables input and button when loading', () => {
    render(<ChatInput onSend={() => {}} isLoading={true} />)
    expect(screen.getByPlaceholderText(/message/i)).toBeDisabled()
    expect(screen.getByRole('button', { name: /send/i })).toBeDisabled()
  })

  it('renders suggestion buttons when provided', () => {
    render(
      <ChatInput
        onSend={() => {}}
        isLoading={false}
        suggestions={['Travel', 'Career']}
      />
    )
    expect(screen.getByText('Travel')).toBeInTheDocument()
    expect(screen.getByText('Career')).toBeInTheDocument()
  })

  it('clears input after sending', async () => {
    const user = userEvent.setup()
    render(<ChatInput onSend={() => {}} isLoading={false} />)

    const input = screen.getByPlaceholderText(/message/i) as HTMLInputElement
    await user.type(input, 'Test message')

    const sendButton = screen.getByRole('button', { name: /send/i })
    await user.click(sendButton)

    expect(input.value).toBe('')
  })
})
