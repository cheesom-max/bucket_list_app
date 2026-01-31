'use client'

import { GoalCard } from './goal-card'
import { Card, CardContent } from '@/components/ui/card'
import { Target } from 'lucide-react'

interface BucketItem {
  id: string
  title: string
  description: string | null
  category: string | null
  priority: number
  status: string
  targetDate: string | null
  completedAt: string | null
  progress?: Array<{ percentage: number }>
}

interface ActiveGoalsGridProps {
  goals: BucketItem[]
  isLoading: boolean
}

function GoalCardSkeleton() {
  return (
    <Card data-testid="goal-card-skeleton" className="h-48 animate-pulse">
      <CardContent className="p-6 space-y-4">
        <div className="h-6 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-1/2" />
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-2 bg-muted rounded w-full" />
      </CardContent>
    </Card>
  )
}

export function ActiveGoalsGrid({ goals, isLoading }: ActiveGoalsGridProps) {
  if (isLoading) {
    return (
      <div data-testid="goals-grid" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <GoalCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (goals.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-12 text-center">
          <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No active goals yet</h3>
          <p className="text-muted-foreground">
            Start your journey by creating your first bucket list goal!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div data-testid="goals-grid" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {goals.map((goal) => {
        const progress = goal.progress?.[0]?.percentage || 0
        return <GoalCard key={goal.id} goal={goal} progress={progress} />
      })}
    </div>
  )
}
