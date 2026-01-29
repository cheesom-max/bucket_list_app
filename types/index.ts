import { BucketItem, BucketPlan, BucketProgress, BucketMedia, BucketDiary, Tag } from '@prisma/client'

export type BucketItemWithRelations = BucketItem & {
  plans?: BucketPlan[]
  progress?: BucketProgress[]
  media?: BucketMedia[]
  diary?: BucketDiary[]
  tags?: (BucketItemTag & { tag: Tag })[]
}

export type BucketItemTag = {
  id: string
  bucketItemId: string
  tagId: string
}

export type BucketItemStatus = 'planned' | 'in_progress' | 'completed' | 'paused'

export type BucketItemPriority = 0 | 1 | 2 // low, medium, high

export type GeminiSuggestionRequest = {
  category?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  interests?: string[]
  age?: number
}

export type GeminiPlanRequest = {
  bucketItemId: string
  title: string
  description?: string
}

export type BucketPlanStep = {
  title: string
  description: string
  order: number
  estimatedTime?: string
}

export type BucketPlanResponse = {
  steps: BucketPlanStep[]
  timeline?: {
    estimatedDuration: string
    milestones: Array<{
      date: string
      description: string
    }>
  }
  resources?: {
    cost?: string
    time?: string
    materials?: string[]
  }
  obstacles?: Array<{
    obstacle: string
    solution: string
  }>
}

