'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter, useParams } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { BucketItemForm } from '@/components/bucket-item/bucket-item-form'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'
import { MediaUpload } from '@/components/bucket-item/media-upload'
import { QuickPlanDialog } from '@/components/bucket-item/quick-plan-dialog'

export default function BucketItemDetailPage() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const [progressDialogOpen, setProgressDialogOpen] = useState(false)
  const [planDialogOpen, setPlanDialogOpen] = useState(false)
  const [progressPercentage, setProgressPercentage] = useState(0)
  const [progressNotes, setProgressNotes] = useState('')

  const { data: item, isLoading } = useQuery({
    queryKey: ['bucket-item', params.id],
    queryFn: async () => {
      const res = await fetch(`/api/bucket-items/${params.id}`)
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/bucket-items/${params.id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bucket-items'] })
      router.push('/dashboard')
    },
  })

  const progressMutation = useMutation({
    mutationFn: async (data: { percentage: number; notes?: string }) => {
      const res = await fetch(`/api/bucket-items/${params.id}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to create progress')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bucket-item', params.id] })
      setProgressDialogOpen(false)
      setProgressPercentage(0)
      setProgressNotes('')
    },
  })

  const planMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/gemini/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bucketItemId: params.id,
          title: item.title,
          description: item.description,
        }),
      })
      if (!res.ok) throw new Error('Failed to generate plan')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bucket-item', params.id] })
      setPlanDialogOpen(false)
    },
  })

  const handleDelete = () => {
    if (confirm('정말 삭제하시겠습니까?')) {
      deleteMutation.mutate()
    }
  }

  const handleProgressSubmit = () => {
    progressMutation.mutate({
      percentage: progressPercentage,
      notes: progressNotes || undefined,
    })
  }

  const handleGeneratePlan = () => {
    planMutation.mutate()
  }

  if (isLoading) {
    return <div className="text-center py-8">로딩 중...</div>
  }

  if (!item) {
    return <div className="text-center py-8">항목을 찾을 수 없습니다.</div>
  }

  if (isEditing) {
    return (
      <div className="max-w-2xl mx-auto">
        <BucketItemForm initialData={item} />
        <div className="mt-4">
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            취소
          </Button>
        </div>
      </div>
    )
  }

  const latestProgress = item.progress?.[0]?.percentage || 0
  const plan = item.plans?.[0]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{item.title}</h1>
          {item.description && (
            <p className="text-muted-foreground">{item.description}</p>
          )}
          <div className="flex gap-2">
            {item.category && <Badge variant="outline">{item.category}</Badge>}
            <Badge>
              {item.status === 'completed'
                ? '완료'
                : item.status === 'in_progress'
                ? '진행 중'
                : item.status === 'paused'
                ? '보류'
                : '계획 중'}
            </Badge>
            <Badge variant={item.priority === 2 ? 'destructive' : item.priority === 1 ? 'default' : 'secondary'}>
              {item.priority === 2 ? '높음' : item.priority === 1 ? '보통' : '낮음'}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <QuickPlanDialog
            bucketItemId={params.id as string}
            title={item.title}
            description={item.description}
            trigger={
              <Button variant="default" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                ✨ AI 계획 생성
              </Button>
            }
          />
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            수정
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            삭제
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>진행 상황</CardTitle>
            <CardDescription>목표 달성 진행률</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{latestProgress}%</span>
              </div>
              <Progress value={latestProgress} />
            </div>
            <Dialog open={progressDialogOpen} onOpenChange={setProgressDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">진행 상황 업데이트</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>진행 상황 업데이트</DialogTitle>
                  <DialogDescription>
                    현재 진행률을 입력하세요 (0-100%)
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="percentage">진행률 (%)</Label>
                    <Input
                      id="percentage"
                      type="number"
                      min="0"
                      max="100"
                      value={progressPercentage}
                      onChange={(e) => setProgressPercentage(parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">메모</Label>
                    <Textarea
                      id="notes"
                      value={progressNotes}
                      onChange={(e) => setProgressNotes(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <Button
                    onClick={handleProgressSubmit}
                    disabled={progressMutation.isPending}
                    className="w-full"
                  >
                    {progressMutation.isPending ? '저장 중...' : '저장'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>달성 계획</CardTitle>
            <CardDescription>AI가 생성한 액션 플랜</CardDescription>
          </CardHeader>
          <CardContent>
            {plan ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">단계</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    {Array.isArray(plan.steps) &&
                      plan.steps.map((step: any, index: number) => (
                        <li key={index}>{step.title || step}</li>
                      ))}
                  </ol>
                </div>
                {plan.timeline && (
                  <div>
                    <h4 className="font-semibold mb-2">타임라인</h4>
                    <p className="text-sm text-muted-foreground">
                      {plan.timeline.estimatedDuration || 'N/A'}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-4">
                  아직 계획이 생성되지 않았습니다.
                </p>
                <Dialog open={planDialogOpen} onOpenChange={setPlanDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={handleGeneratePlan} disabled={planMutation.isPending}>
                      {planMutation.isPending ? '생성 중...' : 'AI 계획 생성'}
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {item.progress && item.progress.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>진행 기록</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {item.progress.map((progress: any) => (
                <div key={progress.id} className="border-l-2 pl-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{progress.percentage}%</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(progress.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                  {progress.milestone && (
                    <p className="text-sm text-muted-foreground">{progress.milestone}</p>
                  )}
                  {progress.notes && (
                    <p className="text-sm mt-1">{progress.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <MediaUpload bucketItemId={params.id as string} />
    </div>
  )
}

