'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, CheckCircle2, TrendingUp, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ActivityItem {
  id: string
  type: string
  message: string
  createdAt: string
}

interface RecentActivityProps {
  activities: ActivityItem[]
}

function getActivityIcon(type: string) {
  switch (type) {
    case 'complete':
      return <CheckCircle2 className="h-4 w-4 text-green-500" />
    case 'progress':
      return <TrendingUp className="h-4 w-4 text-blue-500" />
    case 'create':
      return <Plus className="h-4 w-4 text-purple-500" />
    default:
      return <Activity className="h-4 w-4 text-muted-foreground" />
  }
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activities.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No recent activity
          </p>
        ) : (
          activities.slice(0, 5).map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-2 rounded-lg"
            >
              <div className="mt-0.5">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm line-clamp-2">{activity.message}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatTimeAgo(activity.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
