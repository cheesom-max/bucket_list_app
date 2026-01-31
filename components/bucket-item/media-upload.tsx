'use client'

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import Image from 'next/image'

type MediaUploadProps = {
  bucketItemId: string
}

export function MediaUpload({ bucketItemId }: MediaUploadProps) {
  const queryClient = useQueryClient()
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [caption, setCaption] = useState('')
  const [uploading, setUploading] = useState(false)

  const { data: mediaList } = useQuery({
    queryKey: ['bucket-item-media', bucketItemId],
    queryFn: async () => {
      const res = await fetch(`/api/bucket-items/${bucketItemId}/media`)
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
  })

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch(`/api/bucket-items/${bucketItemId}/media`, {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) throw new Error('Failed to upload')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bucket-item-media', bucketItemId] })
      queryClient.invalidateQueries({ queryKey: ['bucket-item', bucketItemId] })
      setUploadDialogOpen(false)
      setFile(null)
      setCaption('')
    },
  })

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    if (caption) {
      formData.append('caption', caption)
    }

    try {
      await uploadMutation.mutateAsync(formData)
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>사진 및 영상</CardTitle>
            <CardDescription>달성 과정을 기록하세요</CardDescription>
          </div>
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">업로드</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>미디어 업로드</DialogTitle>
                <DialogDescription>
                  사진이나 영상을 업로드하세요
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="file">파일 선택</Label>
                  <Input
                    id="file"
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="caption">캡션</Label>
                  <Input
                    id="caption"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="사진에 대한 설명을 입력하세요"
                  />
                </div>
                <Button
                  onClick={handleUpload}
                  disabled={!file || uploading}
                  className="w-full"
                >
                  {uploading ? '업로드 중...' : '업로드'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {mediaList && mediaList.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {mediaList.map((media: { id: string; type: string; url: string; caption?: string }) => (
              <div key={media.id} className="relative aspect-square">
                {media.type === 'image' ? (
                  <Image
                    src={media.url}
                    alt={media.caption || 'Bucket list media'}
                    fill
                    className="object-cover rounded-lg"
                  />
                ) : (
                  <video
                    src={media.url}
                    controls
                    className="w-full h-full object-cover rounded-lg"
                  />
                )}
                {media.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-sm p-2 rounded-b-lg">
                    {media.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            아직 업로드된 미디어가 없습니다.
          </div>
        )}
      </CardContent>
    </Card>
  )
}

