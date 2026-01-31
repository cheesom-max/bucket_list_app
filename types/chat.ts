export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: Date
  suggestions?: string[]
}

export interface Experience {
  id: string
  title: string
  description: string
  category: string
  imageUrl?: string
  difficulty?: 'easy' | 'medium' | 'hard'
}
