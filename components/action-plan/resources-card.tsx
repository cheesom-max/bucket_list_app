'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, Clock, Package, Link } from 'lucide-react'
import type { Resource } from '@/types'

interface ResourcesCardProps {
  resources: Resource[]
}

const resourceIcons: Record<string, React.ReactNode> = {
  cost: <DollarSign className="h-4 w-4" />,
  time: <Clock className="h-4 w-4" />,
  material: <Package className="h-4 w-4" />,
  link: <Link className="h-4 w-4" />,
}

export function ResourcesCard({ resources }: ResourcesCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Resources Needed</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {resources.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-2">
            No resources defined yet
          </p>
        ) : (
          resources.map((resource, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-2 rounded-lg bg-muted/50"
            >
              <div className="text-muted-foreground mt-0.5">
                {resourceIcons[resource.type]}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{resource.label}</p>
                {resource.url ? (
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {resource.value}
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground">{resource.value}</p>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
