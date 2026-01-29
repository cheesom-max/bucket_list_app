import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/session'
import { prisma } from '@/lib/db/prisma'
import { z } from 'zod'

const createTagSchema = z.object({
  name: z.string().min(1),
})

// GET /api/tags - 태그 목록 조회
export async function GET(request: NextRequest) {
  try {
    await requireAuth()

    const tags = await prisma.tag.findMany({
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(tags)
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.error('Get tags error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/tags - 새 태그 생성
export async function POST(request: NextRequest) {
  try {
    await requireAuth()
    const body = await request.json()
    const validatedData = createTagSchema.parse(body)

    const tag = await prisma.tag.upsert({
      where: { name: validatedData.name },
      update: {},
      create: {
        name: validatedData.name,
      },
    })

    return NextResponse.json(tag, { status: 201 })
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

    console.error('Create tag error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

