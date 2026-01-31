'use client'

import { TimelineStep } from './timeline-step'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ListChecks } from 'lucide-react'
import type { PlanStep } from '@/types'

interface ActionTimelineProps {
  steps: PlanStep[]
  onStepComplete: (stepId: string) => void
}

function getStepStatus(step: PlanStep, index: number, steps: PlanStep[]): 'completed' | 'in_progress' | 'pending' {
  if (step.isCompleted) return 'completed'

  // First uncompleted step is in_progress
  const firstUncompletedIndex = steps.findIndex((s) => !s.isCompleted)
  if (firstUncompletedIndex === index) return 'in_progress'

  return 'pending'
}

export function ActionTimeline({ steps, onStepComplete }: ActionTimelineProps) {
  if (steps.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <ListChecks className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Action Plan Yet</h3>
          <p className="text-muted-foreground">
            Generate a plan with AI to get started on your goal.
          </p>
        </CardContent>
      </Card>
    )
  }

  const sortedSteps = [...steps].sort((a, b) => a.order - b.order)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListChecks className="h-5 w-5" />
          Action Plan
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline connector line */}
          <div
            data-testid="timeline-connector"
            className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted"
            style={{ height: `calc(100% - 32px)` }}
          />

          {/* Steps */}
          <div className="relative">
            {sortedSteps.map((step, index) => (
              <TimelineStep
                key={step.id}
                step={step}
                status={getStepStatus(step, index, sortedSteps)}
                onComplete={() => onStepComplete(step.id)}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
