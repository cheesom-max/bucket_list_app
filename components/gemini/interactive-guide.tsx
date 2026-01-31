'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { GuideQuestion, GuideAnswers } from '@/lib/gemini/guide'

type GuideStep = 'welcome' | 'questions' | 'suggestions' | 'planning'

export function InteractiveGuide() {
  const router = useRouter()
  const [step, setStep] = useState<GuideStep>('welcome')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [questions, setQuestions] = useState<GuideQuestion[]>([])
  const [answers, setAnswers] = useState<GuideAnswers>({})
  const [currentAnswer, setCurrentAnswer] = useState<string | number | string[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [explanation, setExplanation] = useState('')
  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (step === 'questions' && questions.length === 0) {
      loadQuestions()
    }
  }, [step])

  const loadQuestions = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/gemini/guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step: 'questions',
          previousAnswers: answers,
        }),
      })

      if (!response.ok) throw new Error('Failed to load questions')

      const data = await response.json()
      setQuestions(data.questions || [])
      setCurrentQuestionIndex(0)
    } catch (error) {
      console.error('Error loading questions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = (value: string | number | string[]) => {
    setCurrentAnswer(value)
  }

  const handleNextQuestion = () => {
    if (currentAnswer === null) return

    const currentQuestion = questions[currentQuestionIndex]
    setAnswers({
      ...answers,
      [currentQuestion.key]: currentAnswer,
    })

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setCurrentAnswer(null)
    } else {
      // All questions answered, load more questions or generate suggestions
      loadMoreQuestionsOrSuggestions()
    }
  }

  const loadMoreQuestionsOrSuggestions = async () => {
    setLoading(true)
    try {
      // Try to get more questions first
      const questionsResponse = await fetch('/api/gemini/guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step: 'questions',
          previousAnswers: answers,
        }),
      })

      if (questionsResponse.ok) {
        const questionsData = await questionsResponse.json()
        if (questionsData.questions && questionsData.questions.length > 0) {
          setQuestions(questionsData.questions)
          setCurrentQuestionIndex(0)
          setCurrentAnswer(null)
          setLoading(false)
          return
        }
      }

      // If no more questions, generate suggestions
      const suggestionsResponse = await fetch('/api/gemini/guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step: 'suggestions',
          answers: answers,
        }),
      })

      if (suggestionsResponse.ok) {
        const suggestionsData = await suggestionsResponse.json()
        setSuggestions(suggestionsData.suggestions || [])
        setExplanation(suggestionsData.explanation || '')
        setStep('suggestions')
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSuggestionToggle = (suggestion: string) => {
    const newSelected = new Set(selectedSuggestions)
    if (newSelected.has(suggestion)) {
      newSelected.delete(suggestion)
    } else {
      newSelected.add(suggestion)
    }
    setSelectedSuggestions(newSelected)
  }

  const handleAddSelectedSuggestions = async () => {
    setLoading(true)
    try {
      const promises = Array.from(selectedSuggestions).map((suggestion) =>
        fetch('/api/bucket-items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: suggestion,
            status: 'planned',
            priority: 0,
          }),
        })
      )

      await Promise.all(promises)
      router.refresh()
      router.push('/dashboard')
    } catch (error) {
      console.error('Error adding suggestions:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderQuestionInput = (question: GuideQuestion) => {
    switch (question.type) {
      case 'number':
        return (
          <Input
            type="number"
            value={typeof currentAnswer === 'number' ? currentAnswer : ''}
            onChange={(e) => handleAnswer(parseInt(e.target.value) || 0)}
            placeholder="숫자를 입력하세요"
          />
        )

      case 'multiple_choice':
        return (
          <Select value={typeof currentAnswer === 'string' ? currentAnswer : ''} onValueChange={handleAnswer}>
            <SelectTrigger>
              <SelectValue placeholder="선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case 'multi_select':
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={option}
                  checked={
                    Array.isArray(currentAnswer) && currentAnswer.includes(option)
                  }
                  onCheckedChange={(checked) => {
                    const current = Array.isArray(currentAnswer) ? currentAnswer : []
                    if (checked) {
                      handleAnswer([...current, option])
                    } else {
                      handleAnswer(current.filter((item) => item !== option))
                    }
                  }}
                />
                <Label htmlFor={option} className="cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        )

      default:
        return (
          <Input
            value={typeof currentAnswer === 'string' ? currentAnswer : ''}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder="답변을 입력하세요"
          />
        )
    }
  }

  if (step === 'welcome') {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>버킷리스트 가이드에 오신 것을 환영합니다!</CardTitle>
          <CardDescription>
            AI가 당신에게 맞는 버킷리스트를 찾도록 도와드리겠습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            몇 가지 질문에 답해주시면, 당신의 관심사와 상황에 맞는 맞춤형
            버킷리스트를 추천해드립니다. 그리고 각 항목에 대한 구체적인 달성
            계획도 함께 제공해드립니다.
          </p>
          <Button onClick={() => setStep('questions')} className="w-full" size="lg">
            시작하기
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (step === 'questions') {
    if (loading && questions.length === 0) {
      return (
        <Card className="max-w-2xl mx-auto">
          <CardContent className="py-8 text-center">
            <p>질문을 준비하고 있습니다...</p>
          </CardContent>
        </Card>
      )
    }

    if (questions.length === 0) {
      return null
    }

    const currentQuestion = questions[currentQuestionIndex]
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100

    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>질문 {currentQuestionIndex + 1} / {questions.length}</CardTitle>
          <CardDescription>
            <Progress value={progress} className="mt-2" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-lg">{currentQuestion.question}</Label>
            {renderQuestionInput(currentQuestion)}
          </div>
          <div className="flex gap-2">
            {currentQuestionIndex > 0 && (
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentQuestionIndex(currentQuestionIndex - 1)
                  const prevKey = questions[currentQuestionIndex - 1].key
                  setCurrentAnswer(answers[prevKey] || null)
                }}
              >
                이전
              </Button>
            )}
            <Button
              onClick={handleNextQuestion}
              disabled={currentAnswer === null || loading}
              className="flex-1"
            >
              {loading ? '처리 중...' : currentQuestionIndex < questions.length - 1 ? '다음' : '완료'}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (step === 'suggestions') {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>맞춤형 버킷리스트 추천</CardTitle>
          <CardDescription>{explanation}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedSuggestions.has(suggestion)
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
                onClick={() => handleSuggestionToggle(suggestion)}
              >
                <Checkbox
                  checked={selectedSuggestions.has(suggestion)}
                  onCheckedChange={() => handleSuggestionToggle(suggestion)}
                />
                <Label className="flex-1 cursor-pointer">{suggestion}</Label>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setStep('questions')
                setCurrentQuestionIndex(0)
                setCurrentAnswer(null)
              }}
            >
              다시 질문하기
            </Button>
            <Button
              onClick={handleAddSelectedSuggestions}
              disabled={selectedSuggestions.size === 0 || loading}
              className="flex-1"
            >
              {loading
                ? '추가 중...'
                : `선택한 ${selectedSuggestions.size}개 항목 추가하기`}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return null
}

