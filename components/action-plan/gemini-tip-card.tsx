'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles, RefreshCw } from 'lucide-react'

interface GeminiTipCardProps {
  tip: string
  onRefresh: () => void
  isLoading?: boolean
}

export function GeminiTipCard({ tip, onRefresh, isLoading }: GeminiTipCardProps) {
  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
              AI Tip
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        <p className="text-sm text-foreground/80">{tip}</p>
      </CardContent>
    </Card>
  )
}
