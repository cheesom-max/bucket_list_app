'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

export function SuggestionsDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [formData, setFormData] = useState({
    category: '',
    difficulty: '',
    age: '',
  })

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/gemini/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: formData.category || undefined,
          difficulty: formData.difficulty || undefined,
          age: formData.age ? parseInt(formData.age) : undefined,
        }),
      })

      if (!response.ok) throw new Error('Failed to generate suggestions')

      const data = await response.json()
      setSuggestions(data.suggestions || [])
    } catch (error) {
      console.error('Error generating suggestions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddSuggestion = async (title: string) => {
    try {
      const response = await fetch('/api/bucket-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          status: 'planned',
          priority: 0,
        }),
      })

      if (response.ok) {
        router.refresh()
        setOpen(false)
      }
    } catch (error) {
      console.error('Error adding item:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">AI 추천 받기</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>AI 버킷리스트 추천</DialogTitle>
          <DialogDescription>
            Gemini AI가 당신에게 맞는 버킷리스트를 추천해드립니다.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">카테고리</Label>
              <Input
                id="category"
                placeholder="예: 여행, 취미"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="difficulty">난이도</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value) =>
                  setFormData({ ...formData, difficulty: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">초보자</SelectItem>
                  <SelectItem value="intermediate">중급</SelectItem>
                  <SelectItem value="advanced">고급</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">나이</Label>
              <Input
                id="age"
                type="number"
                placeholder="예: 25"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
              />
            </div>
          </div>
          <Button onClick={handleGenerate} disabled={loading} className="w-full">
            {loading ? '생성 중...' : '추천 받기'}
          </Button>
          {suggestions.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold">추천 항목:</h4>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => handleAddSuggestion(suggestion)}
                  >
                    {suggestion} +
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

