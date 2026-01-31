'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Target } from 'lucide-react'
import Link from 'next/link'

interface Milestone {
  id: string
  title: string
  targetDate: string
}

interface UpcomingMilestonesProps {
  milestones: Milestone[]
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

function getDaysUntil(dateString: string): number {
  const target = new Date(dateString)
  const now = new Date()
  const diff = target.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function UpcomingMilestones({ milestones }: UpcomingMilestonesProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Upcoming Milestones
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {milestones.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No upcoming milestones
          </p>
        ) : (
          milestones.slice(0, 5).map((milestone) => {
            const daysUntil = getDaysUntil(milestone.targetDate)
            return (
              <Link
                key={milestone.id}
                href={`/dashboard/bucket-items/${milestone.id}`}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium line-clamp-1">
                    {milestone.title}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDate(milestone.targetDate)}
                  {daysUntil > 0 && (
                    <span className="ml-1">({daysUntil}d)</span>
                  )}
                </div>
              </Link>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
