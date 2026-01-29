'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const bucketItemSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요'),
  description: z.string().optional(),
  category: z.string().optional(),
  priority: z.number().int().min(0).max(2),
  status: z.enum(['planned', 'in_progress', 'completed', 'paused']),
  targetDate: z.string().optional(),
})

type BucketItemFormData = z.infer<typeof bucketItemSchema>

type BucketItemFormProps = {
  initialData?: {
    id: string
    title: string
    description?: string | null
    category?: string | null
    priority: number
    status: string
    targetDate?: string | null
  }
}

export function BucketItemForm({ initialData }: BucketItemFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BucketItemFormData>({
    resolver: zodResolver(bucketItemSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description || '',
          category: initialData.category || '',
          priority: initialData.priority,
          status: initialData.status as any,
          targetDate: initialData.targetDate
            ? new Date(initialData.targetDate).toISOString().split('T')[0]
            : '',
        }
      : {
          priority: 0,
          status: 'planned',
        },
  })

  const onSubmit = async (data: BucketItemFormData) => {
    setLoading(true)
    setError('')

    try {
      const url = initialData
        ? `/api/bucket-items/${initialData.id}`
        : '/api/bucket-items'
      const method = initialData ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          targetDate: data.targetDate ? new Date(data.targetDate).toISOString() : null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.error || '저장 중 오류가 발생했습니다.')
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError('저장 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? '항목 수정' : '새 항목 추가'}</CardTitle>
        <CardDescription>
          {initialData ? '버킷리스트 항목을 수정하세요' : '새로운 버킷리스트 항목을 추가하세요'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">제목 *</Label>
            <Input id="title" {...register('title')} />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">설명</Label>
            <Textarea
              id="description"
              {...register('description')}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">카테고리</Label>
              <Input id="category" {...register('category')} placeholder="예: 여행, 취미" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">우선순위</Label>
              <Select
                value={watch('priority').toString()}
                onValueChange={(value) => setValue('priority', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">낮음</SelectItem>
                  <SelectItem value="1">보통</SelectItem>
                  <SelectItem value="2">높음</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">상태</Label>
              <Select
                value={watch('status')}
                onValueChange={(value) => setValue('status', value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">계획 중</SelectItem>
                  <SelectItem value="in_progress">진행 중</SelectItem>
                  <SelectItem value="completed">완료</SelectItem>
                  <SelectItem value="paused">보류</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetDate">목표 날짜</Label>
              <Input
                id="targetDate"
                type="date"
                {...register('targetDate')}
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? '저장 중...' : '저장'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              취소
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

