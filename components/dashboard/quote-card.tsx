'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Quote } from 'lucide-react'

interface QuoteCardProps {
  quote: string
  author?: string
}

export function QuoteCard({ quote, author }: QuoteCardProps) {
  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
      <CardContent className="p-6">
        <Quote
          data-testid="quote-icon"
          className="h-8 w-8 text-primary/40 mb-3"
        />
        <blockquote className="text-sm italic text-foreground/80">
          "{quote}"
        </blockquote>
        {author && (
          <p
            data-testid="quote-author"
            className="text-xs text-muted-foreground mt-3 text-right"
          >
            - {author}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
