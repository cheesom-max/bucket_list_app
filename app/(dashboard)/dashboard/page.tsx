'use client'

import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { RightSidebar } from '@/components/layout/right-sidebar'
import {
  HeaderSection,
  AIHeroSection,
  ActiveGoalsGrid,
  UpcomingMilestones,
  RecentActivity,
  QuoteCard,
} from '@/components/dashboard'

type BucketItem = {
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

// Default motivational quotes
const defaultQuotes = [
  { quote: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
  { quote: "Dream big, start small, act now.", author: "Robin Sharma" },
  { quote: "Life is either a daring adventure or nothing at all.", author: "Helen Keller" },
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
]

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  const { data, isLoading } = useQuery<{
    items: BucketItem[]
    pagination: { total: number; pages: number }
  }>({
    queryKey: ['bucket-items'],
    queryFn: async () => {
      const res = await fetch('/api/bucket-items')
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
    enabled: status === 'authenticated',
  })

  if (status === 'loading') {
    return (
      <div className="flex flex-1">
        <main className="flex-1 p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-muted rounded w-1/3" />
            <div className="h-48 bg-muted rounded-2xl" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-muted rounded-xl" />
              ))}
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const items = data?.items || []

  // Filter active goals (in_progress or planned, not completed)
  const activeGoals = items.filter(
    (item) => item.status !== 'completed' && item.status !== 'paused'
  )

  // Get upcoming milestones (items with target dates)
  const upcomingMilestones = items
    .filter((item) => item.targetDate && item.status !== 'completed')
    .sort((a, b) => new Date(a.targetDate!).getTime() - new Date(b.targetDate!).getTime())
    .slice(0, 5)
    .map((item) => ({
      id: item.id,
      title: item.title,
      targetDate: item.targetDate!,
    }))

  // Mock recent activities (in real app, this would come from API)
  const recentActivities = items.slice(0, 3).map((item) => ({
    id: item.id,
    type: item.status === 'completed' ? 'complete' : 'progress',
    message: `Updated "${item.title}"`,
    createdAt: new Date().toISOString(),
  }))

  // Random quote
  const randomQuote = defaultQuotes[Math.floor(Math.random() * defaultQuotes.length)]

  const handleExploreAI = () => {
    router.push('/dashboard/guide')
  }

  return (
    <div className="flex flex-1">
      {/* Main Content Area */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <HeaderSection
            userName={session.user?.name || session.user?.email?.split('@')[0] || 'User'}
          />

          {/* AI Hero Section */}
          <AIHeroSection onExplore={handleExploreAI} />

          {/* Active Goals Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Active Goals</h2>
            <ActiveGoalsGrid goals={activeGoals} isLoading={isLoading} />
          </div>
        </div>
      </main>

      {/* Right Sidebar */}
      <RightSidebar className="p-4 space-y-4">
        <UpcomingMilestones milestones={upcomingMilestones} />
        <RecentActivity activities={recentActivities} />
        <QuoteCard quote={randomQuote.quote} author={randomQuote.author} />
      </RightSidebar>
    </div>
  )
}
