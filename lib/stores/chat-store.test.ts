import { describe, it, expect, beforeEach } from 'vitest'
import { useChatStore } from './chat-store'

describe('ChatStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useChatStore.getState().clearMessages()
  })

  it('should have empty messages initially', () => {
    const { messages } = useChatStore.getState()
    expect(messages).toEqual([])
  })

  it('should add a message', () => {
    const { addMessage, messages } = useChatStore.getState()

    addMessage({
      id: '1',
      role: 'user',
      content: 'Hello',
      createdAt: new Date(),
    })

    const updatedMessages = useChatStore.getState().messages
    expect(updatedMessages.length).toBe(1)
    expect(updatedMessages[0].content).toBe('Hello')
    expect(updatedMessages[0].role).toBe('user')
  })

  it('should clear all messages', () => {
    const { addMessage, clearMessages } = useChatStore.getState()

    addMessage({
      id: '1',
      role: 'user',
      content: 'Hello',
      createdAt: new Date(),
    })

    addMessage({
      id: '2',
      role: 'assistant',
      content: 'Hi there!',
      createdAt: new Date(),
    })

    clearMessages()

    const { messages } = useChatStore.getState()
    expect(messages.length).toBe(0)
  })

  it('should set typing state', () => {
    const { setTyping, isTyping } = useChatStore.getState()

    expect(isTyping).toBe(false)

    setTyping(true)
    expect(useChatStore.getState().isTyping).toBe(true)

    setTyping(false)
    expect(useChatStore.getState().isTyping).toBe(false)
  })
})
