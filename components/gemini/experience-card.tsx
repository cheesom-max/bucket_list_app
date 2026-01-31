'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, MapPin, Zap, Heart } from 'lucide-react'
import type { Experience } from '@/types/chat'
import { cn } from '@/lib/utils'

interface ExperienceCardProps {
  experience: Experience
  onAdd: () => void
}

const categoryIcons: Record<string, React.ReactNode> = {
  Travel: <MapPin className="h-4 w-4" />,
  Skill: <Zap className="h-4 w-4" />,
  Personal: <Heart className="h-4 w-4" />,
}

const difficultyColors: Record<string, string> = {
  easy: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  hard: 'bg-red-100 text-red-800',
}

export function ExperienceCard({ experience, onAdd }: ExperienceCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      {experience.imageUrl && (
        <div className="h-24 bg-muted overflow-hidden">
          <img
            src={experience.imageUrl}
            alt={experience.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="font-medium text-sm line-clamp-1">{experience.title}</h4>
          {categoryIcons[experience.category] || categoryIcons.Personal}
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {experience.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Badge variant="secondary" className="text-xs">
              {experience.category}
            </Badge>
            {experience.difficulty && (
              <Badge
                variant="secondary"
                className={cn('text-xs', difficultyColors[experience.difficulty])}
              >
                {experience.difficulty}
              </Badge>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2"
            onClick={onAdd}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
