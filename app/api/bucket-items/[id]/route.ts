import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/session'
import { prisma } from '@/lib/db/prisma'
import { z } from 'zod'

const updateBucketItemSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  priority: z.number().int().min(0).max(2).optional(),
  status: z.enum(['planned', 'in_progress', 'completed', 'paused']).optional(),
  targetDate: z.string().datetime().optional().nullable(),
  tagIds: z.array(z.string()).optional(),
})

// GET /api/bucket-items/[id] - 상세 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth()

    const bucketItem = await prisma.bucketItem.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        plans: true,
        progress: {
          orderBy: { createdAt: 'desc' },
        },
        media: {
          orderBy: { createdAt: 'desc' },
        },
        diary: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!bucketItem) {
      return NextResponse.json(
        { error: 'Bucket item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(bucketItem)
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.error('Get bucket item error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/bucket-items/[id] - 수정
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth()
    const body = await request.json()
    const validatedData = updateBucketItemSchema.parse(body)

    // Verify ownership
    const existingItem = await prisma.bucketItem.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    })

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Bucket item not found' },
        { status: 404 }
      )
    }

    const { tagIds, ...updateData } = validatedData

    // Handle status change to completed
    if (validatedData.status === 'completed' && existingItem.status !== 'completed') {
      updateData.completedAt = new Date() as any
    } else if (validatedData.status !== 'completed' && existingItem.status === 'completed') {
      updateData.completedAt = null as any
    }

    const bucketItem = await prisma.bucketItem.update({
      where: { id: params.id },
      data: {
        ...updateData,
        targetDate: validatedData.targetDate !== undefined
          ? validatedData.targetDate
            ? new Date(validatedData.targetDate)
            : null
          : undefined,
        tags: tagIds
          ? {
              deleteMany: {},
              create: tagIds.map((tagId) => ({
                tagId,
              })),
            }
          : undefined,
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        plans: true,
      },
    })

    return NextResponse.json(bucketItem)
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

    console.error('Update bucket item error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/bucket-items/[id] - 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth()

    // Verify ownership
    const existingItem = await prisma.bucketItem.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    })

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Bucket item not found' },
        { status: 404 }
      )
    }

    await prisma.bucketItem.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Bucket item deleted successfully' })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.error('Delete bucket item error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

