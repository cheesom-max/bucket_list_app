'use client'

import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { SuggestionsDialog } from '@/components/gemini/suggestions-dialog'
import { QuickPlanDialog } from '@/components/bucket-item/quick-plan-dialog'

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
    pagination: any
  }>({
    queryKey: ['bucket-items'],
    queryFn: async () => {
      const res = await fetch('/api/bucket-items')
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
    enabled: status === 'authenticated',
  })

  if (status === 'loading' || isLoading) {
    return <div className="text-center py-8">로딩 중...</div>
  }

  if (!session) {
    return null
  }

  const items = data?.items || []
  const completedCount = items.filter((item) => item.status === 'completed').length
  const inProgressCount = items.filter((item) => item.status === 'in_progress').length
  const plannedCount = items.filter((item) => item.status === 'planned').length

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 2:
        return 'destructive'
      case 1:
        return 'default'
      default:
        return 'secondary'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default'
      case 'in_progress':
        return 'default'
      case 'paused':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">대시보드</h1>
          <p className="text-muted-foreground mt-2">
            {session.user?.name || session.user?.email}님의 버킷리스트
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/guide">
            <Button variant="default" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              🤖 AI 가이드 시작하기
            </Button>
          </Link>
          <SuggestionsDialog />
          <Link href="/dashboard/bucket-items/new">
            <Button>새 항목 추가</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>전체 항목</CardTitle>
            <CardDescription>총 버킷리스트 항목 수</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{items.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>완료</CardTitle>
            <CardDescription>달성한 항목</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>진행 중</CardTitle>
            <CardDescription>현재 진행 중인 항목</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{inProgressCount}</div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">최근 항목</h2>
        {items.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              아직 버킷리스트 항목이 없습니다. 새 항목을 추가해보세요!
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.slice(0, 6).map((item) => {
              const latestProgress = item.progress?.[0]?.percentage || 0
              return (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <Link href={`/dashboard/bucket-items/${item.id}`}>
                        <CardTitle className="text-lg hover:underline cursor-pointer">
                          {item.title}
                        </CardTitle>
                      </Link>
                      <Badge variant={getPriorityColor(item.priority)}>
                        {item.priority === 2 ? '높음' : item.priority === 1 ? '보통' : '낮음'}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {item.description || '설명 없음'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <Badge variant={getStatusColor(item.status)}>
                          {item.status === 'completed'
                            ? '완료'
                            : item.status === 'in_progress'
                            ? '진행 중'
                            : item.status === 'paused'
                            ? '보류'
                            : '계획 중'}
                        </Badge>
                        <span className="text-muted-foreground">{latestProgress}%</span>
                      </div>
                      <Progress value={latestProgress} />
                      <div className="flex gap-2 mt-3">
                        <QuickPlanDialog
                          bucketItemId={item.id}
                          title={item.title}
                          description={item.description}
                          trigger={
                            <Button variant="outline" size="sm" className="flex-1">
                              ✨ 계획 생성
                            </Button>
                          }
                        />
                        <Link href={`/dashboard/bucket-items/${item.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            자세히
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

