'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { CheckCircle2, Circle, Clock } from 'lucide-react'
import type { PlanStep } from '@/types'

interface TimelineStepProps {
  step: PlanStep
  status: 'completed' | 'in_progress' | 'pending'
  onComplete: () => void
}

export function TimelineStep({ step, status, onComplete }: TimelineStepProps) {
  return (
    <div className="flex gap-4 pb-8 relative">
      {/* Indicator */}
      <div className="flex flex-col items-center">
        <div
          data-testid="step-indicator"
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center',
            status === 'completed' && 'bg-green-500 text-white',
            status === 'in_progress' && 'bg-blue-500 text-white',
            status === 'pending' && 'bg-muted text-muted-foreground'
          )}
        >
          {status === 'completed' ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : status === 'in_progress' ? (
            <Circle className="h-5 w-5" />
          ) : (
            <span className="text-sm font-medium">{step.order}</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pt-0.5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h4 className={cn(
              'font-medium',
              status === 'completed' && 'text-muted-foreground line-through'
            )}>
              {step.title}
            </h4>
            {step.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {step.description}
              </p>
            )}
            {step.estimatedDuration && (
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{step.estimatedDuration}</span>
              </div>
            )}
          </div>

          <Checkbox
            checked={status === 'completed'}
            onCheckedChange={onComplete}
            disabled={status === 'completed'}
          />
        </div>
      </div>
    </div>
  )
}
