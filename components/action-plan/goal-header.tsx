'use client'

import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Calendar, Target } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GoalBasic {
  id: string
  title: string
  description: string | null
  category: string | null
  priority: number
  status: string
  targetDate: string | null
}

interface GoalHeaderProps {
  goal: GoalBasic
  progress: number
}

const statusLabels: Record<string, string> = {
  planned: 'Planned',
  in_progress: 'In Progress',
  completed: 'Completed',
  paused: 'Paused',
}

const statusColors: Record<string, string> = {
  planned: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  paused: 'bg-gray-100 text-gray-800',
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function GoalHeader({ goal, progress }: GoalHeaderProps) {
  return (
    <div className="space-y-6 pb-6 border-b">
      {/* Title and Status */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{goal.title}</h1>
          {goal.description && (
            <p className="text-muted-foreground mt-2">{goal.description}</p>
          )}
        </div>
        <Badge
          data-testid="status-badge"
          variant="secondary"
          className={cn('text-sm px-3 py-1', statusColors[goal.status])}
        >
          {statusLabels[goal.status] || goal.status}
        </Badge>
      </div>

      {/* Meta Info */}
      <div className="flex flex-wrap gap-4 text-sm">
        {goal.category && (
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <span>{goal.category}</span>
          </div>
        )}
        {goal.targetDate && (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Target: {formatDate(goal.targetDate)}</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Overall Progress</span>
          <span className="text-2xl font-bold">{progress}%</span>
        </div>
        <Progress data-testid="progress-bar" value={progress} className="h-3" />
      </div>
    </div>
  )
}
