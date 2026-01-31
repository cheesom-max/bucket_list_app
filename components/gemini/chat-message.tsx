'use client'

import { cn } from '@/lib/utils'
import { Sparkles, User } from 'lucide-react'
import type { ChatMessage as ChatMessageType } from '@/types/chat'

interface ChatMessageProps {
  message: ChatMessageType
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div
      data-testid="message-container"
      className={cn('flex gap-3 p-4', isUser ? 'justify-end' : 'justify-start')}
    >
      {!isUser && (
        <div
          data-testid="assistant-avatar"
          className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center"
        >
          <Sparkles className="h-4 w-4 text-white" />
        </div>
      )}

      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-2',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted'
        )}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>

        {message.suggestions && message.suggestions.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.suggestions.map((suggestion, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-background/50 rounded-full"
              >
                {suggestion}
              </span>
            ))}
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="h-4 w-4 text-primary" />
        </div>
      )}
    </div>
  )
}
