import { create } from 'zustand'
import type { ChatMessage } from '@/types/chat'

interface ChatState {
  messages: ChatMessage[]
  isTyping: boolean
  addMessage: (message: ChatMessage) => void
  clearMessages: () => void
  setTyping: (isTyping: boolean) => void
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isTyping: false,

  addMessage: (message: ChatMessage) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  clearMessages: () =>
    set({
      messages: [],
    }),

  setTyping: (isTyping: boolean) =>
    set({
      isTyping,
    }),
}))
