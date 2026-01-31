import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/session'
import {
  generateGuideQuestions,
  generatePersonalizedSuggestions,
  GuideAnswers,
} from '@/lib/gemini/guide'
import { z } from 'zod'

const guideRequestSchema = z.object({
  step: z.enum(['questions', 'suggestions']),
  previousAnswers: z.record(z.string(), z.any()).optional(),
  answers: z.record(z.string(), z.any()).optional(),
})

export async function POST(request: NextRequest) {
  try {
    await requireAuth()

    const body = await request.json()
    const validatedData = guideRequestSchema.parse(body)

    if (validatedData.step === 'questions') {
      const questions = await generateGuideQuestions(
        validatedData.previousAnswers as GuideAnswers | undefined
      )
      return NextResponse.json({ questions }, { status: 200 })
    } else if (validatedData.step === 'suggestions') {
      if (!validatedData.answers) {
        return NextResponse.json(
          { error: 'Answers are required for suggestions step' },
          { status: 400 }
        )
      }
      const result = await generatePersonalizedSuggestions(
        validatedData.answers as GuideAnswers
      )
      return NextResponse.json(result, { status: 200 })
    }

    return NextResponse.json({ error: 'Invalid step' }, { status: 400 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      )
    }

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.error('Guide API error:', error)
    return NextResponse.json(
      { error: 'Failed to process guide request' },
      { status: 500 }
    )
  }
}

