'use client'

import { Button } from '@/components/ui/button'
import { Sparkles, ArrowRight } from 'lucide-react'

interface AIHeroSectionProps {
  suggestion?: {
    title: string
    description: string
  }
  onExplore: () => void
}

export function AIHeroSection({ suggestion, onExplore }: AIHeroSectionProps) {
  return (
    <div
      data-testid="ai-hero-card"
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 p-6 md:p-8 text-white"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-6 w-6" />
            <span className="text-sm font-medium uppercase tracking-wide opacity-90">
              AI Recommendation
            </span>
          </div>

          {suggestion ? (
            <>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                {suggestion.title}
              </h2>
              <p className="text-white/80 text-lg">
                {suggestion.description}
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Discover Your Next Adventure
              </h2>
              <p className="text-white/80 text-lg">
                Let AI help you find meaningful goals to pursue
              </p>
            </>
          )}
        </div>

        <Button
          onClick={onExplore}
          variant="secondary"
          size="lg"
          className="bg-white text-purple-600 hover:bg-white/90 gap-2"
        >
          Explore with AI
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
