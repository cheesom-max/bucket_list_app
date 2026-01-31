'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface HeaderSectionProps {
  userName: string
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export function HeaderSection({ userName }: HeaderSectionProps) {
  const greeting = getGreeting()

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1
          data-testid="greeting"
          className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white"
        >
          {greeting}, {userName}
        </h1>
        <p className="text-muted-foreground mt-1">
          What would you like to achieve today?
        </p>
      </div>
      <Link href="/dashboard/bucket-items/new">
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Goal
        </Button>
      </Link>
    </div>
  )
}
