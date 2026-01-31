'use client'

import { useRef, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useChatStore } from '@/lib/stores/chat-store'
import { ChatMessage } from './chat-message'
import { ChatInput } from './chat-input'
import { Sparkles } from 'lucide-react'

const defaultSuggestions = [
  'Suggest a travel destination',
  'Help me learn a new skill',
  'Career development ideas',
  'Health and wellness goals',
]

export function ChatInterface() {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { messages, isTyping, addMessage, setTyping } = useChatStore()

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await fetch('/api/gemini/guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content }),
      })
      if (!res.ok) throw new Error('Failed to send message')
      return res.json()
    },
    onMutate: (content) => {
      // Add user message
      addMessage({
        id: Date.now().toString(),
        role: 'user',
        content,
        createdAt: new Date(),
      })
      setTyping(true)
    },
    onSuccess: (data) => {
      // Add assistant message
      addMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || data.message || 'I apologize, I could not process that.',
        createdAt: new Date(),
        suggestions: data.suggestions,
      })
      setTyping(false)
    },
    onError: () => {
      addMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.',
        createdAt: new Date(),
      })
      setTyping(false)
    },
  })

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = (message: string) => {
    sendMessageMutation.mutate(message)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="font-semibold">AI Guide</h1>
            <p className="text-xs text-muted-foreground">
              Powered by Gemini
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              Let me help you discover new goals
            </h2>
            <p className="text-muted-foreground max-w-md">
              I can suggest bucket list ideas, help you plan your goals, or guide you through discovering what matters most to you.
            </p>
          </div>
        ) : (
          <div className="py-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isTyping && (
              <div className="flex gap-3 p-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white animate-pulse" />
                </div>
                <div className="bg-muted rounded-2xl px-4 py-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <ChatInput
        onSend={handleSend}
        isLoading={sendMessageMutation.isPending || isTyping}
        suggestions={messages.length === 0 ? defaultSuggestions : undefined}
      />
    </div>
  )
}
