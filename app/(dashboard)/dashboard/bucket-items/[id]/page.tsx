'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter, useParams } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { BucketItemForm } from '@/components/bucket-item/bucket-item-form'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RightSidebar } from '@/components/layout/right-sidebar'
import {
  GoalHeader,
  ActionTimeline,
  GeminiTipCard,
  ResourcesCard,
  MediaJournal,
} from '@/components/action-plan'
import { QuickPlanDialog } from '@/components/bucket-item/quick-plan-dialog'
import { ArrowLeft, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import type { PlanStep, Resource } from '@/types'

// Default tip for when AI tip is not available
const defaultTip = "Break down your goal into smaller, manageable steps. Focus on progress, not perfection."

export default function BucketItemDetailPage() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const [progressDialogOpen, setProgressDialogOpen] = useState(false)
  const [progressPercentage, setProgressPercentage] = useState(0)
  const [progressNotes, setProgressNotes] = useState('')
  const [tip, setTip] = useState(defaultTip)

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

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this goal?')) {
      deleteMutation.mutate()
    }
  }

  const handleProgressSubmit = () => {
    progressMutation.mutate({
      percentage: progressPercentage,
      notes: progressNotes || undefined,
    })
  }

  const handleStepComplete = async (stepId: string) => {
    // In a real app, this would update the step completion status via API
    // For now, just invalidate the query to refresh UI
    void stepId // Acknowledge parameter for future implementation
    queryClient.invalidateQueries({ queryKey: ['bucket-item', params.id] })
  }

  const handleRefreshTip = () => {
    // In a real app, this would fetch a new tip from Gemini
    const tips = [
      "Consistency is key. Even 15 minutes a day adds up to significant progress.",
      "Celebrate small wins along the way to stay motivated.",
      "Share your goal with someone who can hold you accountable.",
      "Visualize yourself achieving this goal. What does success look like?",
      "If you feel stuck, try approaching from a different angle.",
    ]
    setTip(tips[Math.floor(Math.random() * tips.length)])
  }

  const handleMediaUpload = async (file: File) => {
    // In a real app, this would upload to the server via /api/bucket-items/:id/media
    // For now, just acknowledge the file for future implementation
    void file // Acknowledge parameter for future implementation
  }

  if (isLoading) {
    return (
      <div className="flex flex-1">
        <main className="flex-1 p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="h-24 bg-muted rounded-xl" />
            <div className="h-64 bg-muted rounded-xl" />
          </div>
        </main>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Goal not found</h2>
          <p className="text-muted-foreground mb-4">
            This goal may have been deleted or doesn't exist.
          </p>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (isEditing) {
    return (
      <div className="flex flex-1 p-6">
        <div className="max-w-2xl mx-auto w-full">
          <BucketItemForm initialData={item} />
          <div className="mt-4">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const latestProgress = item.progress?.[0]?.percentage || 0
  const plan = item.plans?.[0]

  // Convert plan steps to PlanStep format
  const planSteps: PlanStep[] = plan?.steps
    ? plan.steps.map((step: { title?: string; description?: string; estimatedTime?: string }, index: number) => ({
        id: `step-${index}`,
        title: step.title || step,
        description: step.description,
        order: index + 1,
        estimatedDuration: step.estimatedTime,
        isCompleted: false,
      }))
    : []

  // Mock resources from plan
  const resources: Resource[] = []
  if (plan?.resources) {
    if (plan.resources.cost) {
      resources.push({ type: 'cost', label: 'Estimated Budget', value: plan.resources.cost })
    }
    if (plan.resources.time) {
      resources.push({ type: 'time', label: 'Time Required', value: plan.resources.time })
    }
    if (plan.resources.materials) {
      resources.push({ type: 'material', label: 'Materials', value: plan.resources.materials.join(', ') })
    }
  }

  return (
    <div className="flex flex-1">
      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Top Navigation Bar */}
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Link>
            <div className="flex gap-2">
              <QuickPlanDialog
                bucketItemId={params.id as string}
                title={item.title}
                description={item.description}
                trigger={
                  <Button variant="default" className="bg-gradient-to-r from-purple-500 to-pink-500">
                    Generate AI Plan
                  </Button>
                }
              />
              <Button variant="outline" size="icon" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Goal Header */}
          <GoalHeader goal={item} progress={latestProgress} />

          {/* Action Timeline */}
          <ActionTimeline steps={planSteps} onStepComplete={handleStepComplete} />

          {/* Progress Update Dialog */}
          <Dialog open={progressDialogOpen} onOpenChange={setProgressDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">Update Progress</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Progress</DialogTitle>
                <DialogDescription>
                  Enter your current progress (0-100%)
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="percentage">Progress (%)</Label>
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
                  <Label htmlFor="notes">Notes</Label>
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
                  {progressMutation.isPending ? 'Saving...' : 'Save Progress'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Media Journal */}
          <MediaJournal media={item.media || []} onUpload={handleMediaUpload} />
        </div>
      </main>

      {/* Right Sidebar */}
      <RightSidebar className="p-4 space-y-4">
        <GeminiTipCard tip={tip} onRefresh={handleRefreshTip} />
        <ResourcesCard resources={resources} />
      </RightSidebar>
    </div>
  )
}
