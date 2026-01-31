import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/session'
import { generateBucketPlan } from '@/lib/gemini/planning'
import { z } from 'zod'

const planSchema = z.object({
  bucketItemId: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()

    const body = await request.json()
    const validatedData = planSchema.parse(body)

    // Verify the bucket item belongs to the user
    const { prisma } = await import('@/lib/db/prisma')
    const bucketItem = await prisma.bucketItem.findFirst({
      where: {
        id: validatedData.bucketItemId,
        userId: user.id,
      },
    })

    if (!bucketItem) {
      return NextResponse.json(
        { error: 'Bucket item not found' },
        { status: 404 }
      )
    }

    const plan = await generateBucketPlan(
      validatedData.title,
      validatedData.description
    )

    // Save the plan to database
    await prisma.bucketPlan.upsert({
      where: { bucketItemId: validatedData.bucketItemId },
      update: {
        steps: plan.steps as any,
        timeline: plan.timeline as any,
        resources: plan.resources as any,
        obstacles: plan.obstacles as any,
      },
      create: {
        bucketItemId: validatedData.bucketItemId,
        steps: plan.steps as any,
        timeline: plan.timeline as any,
        resources: plan.resources as any,
        obstacles: plan.obstacles as any,
      },
    })

    return NextResponse.json({ plan }, { status: 200 })
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

    console.error('Plan API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate plan' },
      { status: 500 }
    )
  }
}

