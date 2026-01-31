'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExperienceCard } from './experience-card'
import { Compass } from 'lucide-react'
import type { Experience } from '@/types/chat'

interface DiscoveryPanelProps {
  experiences: Experience[]
  onSelect: (experience: Experience) => void
}

export function DiscoveryPanel({ experiences, onSelect }: DiscoveryPanelProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-4 pt-4">
        <Compass className="h-5 w-5 text-primary" />
        <h2 className="font-semibold">Discover Experiences</h2>
      </div>

      <div className="px-4 space-y-3">
        {experiences.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-sm text-muted-foreground">
                No suggestions yet. Start a conversation to get personalized recommendations!
              </p>
            </CardContent>
          </Card>
        ) : (
          experiences.map((experience) => (
            <ExperienceCard
              key={experience.id}
              experience={experience}
              onAdd={() => onSelect(experience)}
            />
          ))
        )}
      </div>
    </div>
  )
}
