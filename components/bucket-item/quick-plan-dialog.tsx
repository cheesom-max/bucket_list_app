'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

type QuickPlanDialogProps = {
  bucketItemId: string
  title: string
  description?: string | null
  trigger?: React.ReactNode
}

export function QuickPlanDialog({
  bucketItemId,
  title,
  description,
  trigger,
}: QuickPlanDialogProps) {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [plan, setPlan] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const planMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/gemini/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bucketItemId,
          title,
          description: description || undefined,
        }),
      })
      if (!res.ok) throw new Error('Failed to generate plan')
      return res.json()
    },
    onSuccess: (data) => {
      setPlan(data.plan)
      queryClient.invalidateQueries({ queryKey: ['bucket-item', bucketItemId] })
    },
  })

  const handleGeneratePlan = () => {
    setLoading(true)
    planMutation.mutate()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            계획 생성
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>"{title}" 달성 계획</DialogTitle>
          <DialogDescription>
            AI가 생성한 구체적인 달성 계획입니다.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {!plan && !loading && (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                이 항목을 달성하기 위한 구체적인 계획을 생성하시겠습니까?
              </p>
              <Button onClick={handleGeneratePlan}>계획 생성하기</Button>
            </div>
          )}

          {loading && (
            <div className="text-center py-8">
              <p>계획을 생성하고 있습니다...</p>
            </div>
          )}

          {plan && (
            <div className="space-y-6">
              {plan.steps && Array.isArray(plan.steps) && plan.steps.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">단계별 액션 플랜</h4>
                  <ol className="space-y-2">
                    {plan.steps.map((step: any, index: number) => (
                      <li key={index} className="flex gap-3">
                        <Badge variant="outline" className="mt-1">
                          {step.order || index + 1}
                        </Badge>
                        <div className="flex-1">
                          <p className="font-medium">{step.title || step}</p>
                          {step.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {step.description}
                            </p>
                          )}
                          {step.estimatedTime && (
                            <p className="text-xs text-muted-foreground mt-1">
                              예상 시간: {step.estimatedTime}
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {plan.timeline && (
                <div>
                  <h4 className="font-semibold mb-3">타임라인</h4>
                  <div className="space-y-2">
                    {plan.timeline.estimatedDuration && (
                      <p className="text-sm">
                        <span className="font-medium">예상 기간:</span>{' '}
                        {plan.timeline.estimatedDuration}
                      </p>
                    )}
                    {plan.timeline.milestones &&
                      Array.isArray(plan.timeline.milestones) &&
                      plan.timeline.milestones.length > 0 && (
                        <div className="mt-2">
                          <p className="font-medium text-sm mb-2">마일스톤:</p>
                          <ul className="space-y-1 text-sm">
                            {plan.timeline.milestones.map(
                              (milestone: any, index: number) => (
                                <li key={index} className="flex gap-2">
                                  <span className="text-muted-foreground">
                                    {milestone.date || `단계 ${index + 1}`}:
                                  </span>
                                  <span>{milestone.description}</span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                  </div>
                </div>
              )}

              {plan.resources && (
                <div>
                  <h4 className="font-semibold mb-3">필요한 자원</h4>
                  <div className="space-y-2 text-sm">
                    {plan.resources.cost && (
                      <p>
                        <span className="font-medium">비용:</span> {plan.resources.cost}
                      </p>
                    )}
                    {plan.resources.time && (
                      <p>
                        <span className="font-medium">시간:</span> {plan.resources.time}
                      </p>
                    )}
                    {plan.resources.materials &&
                      Array.isArray(plan.resources.materials) &&
                      plan.resources.materials.length > 0 && (
                        <div>
                          <span className="font-medium">준비물:</span>
                          <ul className="list-disc list-inside ml-2 mt-1">
                            {plan.resources.materials.map((material: string, index: number) => (
                              <li key={index}>{material}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                </div>
              )}

              {plan.obstacles &&
                Array.isArray(plan.obstacles) &&
                plan.obstacles.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">예상 장애물 및 해결책</h4>
                    <div className="space-y-3">
                      {plan.obstacles.map((item: any, index: number) => (
                        <div key={index} className="border-l-2 pl-3">
                          <p className="font-medium text-sm">
                            {item.obstacle || `장애물 ${index + 1}`}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            해결책: {item.solution}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => setOpen(false)}
                  className="flex-1"
                >
                  확인
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setPlan(null)
                    handleGeneratePlan()
                  }}
                >
                  다시 생성
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

