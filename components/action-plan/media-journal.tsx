'use client'

import { useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Camera, Upload, Image } from 'lucide-react'

interface BucketMedia {
  id: string
  url: string
  type: string
  caption?: string
  createdAt: string
}

interface MediaJournalProps {
  media: BucketMedia[]
  onUpload: (file: File) => void
}

export function MediaJournal({ media, onUpload }: MediaJournalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onUpload(file)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Media Journal
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={handleUploadClick}
          className="gap-2"
        >
          <Upload className="h-4 w-4" />
          Upload
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </CardHeader>
      <CardContent>
        {media.length === 0 ? (
          <div className="text-center py-8">
            <Image className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">
              No photos or videos yet. Capture your journey!
            </p>
          </div>
        ) : (
          <div data-testid="media-grid" className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {media.map((item) => (
              <div
                key={item.id}
                className="aspect-square rounded-lg overflow-hidden bg-muted relative group"
              >
                {item.type.startsWith('image') ? (
                  <img
                    src={item.url}
                    alt={item.caption || 'Media'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={item.url}
                    className="w-full h-full object-cover"
                  />
                )}
                {item.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
