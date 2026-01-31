'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Calendar, Target } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BucketItemBasic {
  id: string
  title: string
  description: string | null
  category: string | null
  priority: number
  status: string
  targetDate: string | null
  completedAt: string | null
}

interface GoalCardProps {
  goal: BucketItemBasic
  progress: number
}

const categoryColors: Record<string, string> = {
  Travel: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  Skill: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  Career: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  Health: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  Personal: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
  default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function GoalCard({ goal, progress }: GoalCardProps) {
  const categoryColorClass = goal.category
    ? categoryColors[goal.category] || categoryColors.default
    : categoryColors.default

  return (
    <Link href={`/dashboard/bucket-items/${goal.id}`}>
      <Card
        data-testid="goal-card"
        className={cn(
          'h-full transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer',
          'border rounded-xl'
        )}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg font-semibold line-clamp-2">
              {goal.title}
            </CardTitle>
            <Target className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          </div>
          {goal.category && (
            <Badge variant="secondary" className={cn('mt-2 w-fit', categoryColorClass)}>
              {goal.category}
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          {goal.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {goal.description}
            </p>
          )}

          <div className="space-y-3">
            {/* Progress */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Target Date */}
            {goal.targetDate && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(goal.targetDate)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
