import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/session'
import { prisma } from '@/lib/db/prisma'
import { z } from 'zod'

const progressSchema = z.object({
  percentage: z.number().int().min(0).max(100),
  milestone: z.string().optional(),
  notes: z.string().optional(),
})

// POST /api/bucket-items/[id]/progress - 진행 상황 기록
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth()
    const body = await request.json()
    const validatedData = progressSchema.parse(body)

    // Verify ownership
    const bucketItem = await prisma.bucketItem.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    })

    if (!bucketItem) {
      return NextResponse.json(
        { error: 'Bucket item not found' },
        { status: 404 }
      )
    }

    const progress = await prisma.bucketProgress.create({
      data: {
        bucketItemId: params.id,
        percentage: validatedData.percentage,
        milestone: validatedData.milestone,
        notes: validatedData.notes,
      },
    })

    // Update bucket item status if percentage is 100
    if (validatedData.percentage === 100 && bucketItem.status !== 'completed') {
      await prisma.bucketItem.update({
        where: { id: params.id },
        data: {
          status: 'completed',
          completedAt: new Date(),
        },
      })
    }

    return NextResponse.json(progress, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.error('Create progress error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

