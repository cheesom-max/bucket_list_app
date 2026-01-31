import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/session'
import { prisma } from '@/lib/db/prisma'

// POST /api/bucket-items/[id]/media - 미디어 업로드
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id } = await params

    // Verify ownership
    const bucketItem = await prisma.bucketItem.findFirst({
      where: {
        id,
        userId: user.id,
      },
    })

    if (!bucketItem) {
      return NextResponse.json(
        { error: 'Bucket item not found' },
        { status: 404 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const caption = formData.get('caption') as string | null

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // In production, upload to Cloudinary or S3 here
    // For now, we'll just store metadata
    // You would typically:
    // 1. Upload file to storage service
    // 2. Get URL from storage service
    // 3. Store URL in database

    // This is a placeholder - in production, replace with actual upload logic
    const fileType = file.type.startsWith('image/') ? 'image' : 'video'
    const fileName = `${Date.now()}-${file.name}`

    // For demo purposes, we'll create a data URL
    // In production, upload to storage and get URL
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataUrl = `data:${file.type};base64,${base64}`

    const media = await prisma.bucketMedia.create({
      data: {
        bucketItemId: id,
        url: dataUrl, // In production, this would be the storage URL
        type: fileType,
        caption: caption || null,
      },
    })

    return NextResponse.json(media, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.error('Upload media error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/bucket-items/[id]/media - 미디어 목록 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id } = await params

    // Verify ownership
    const bucketItem = await prisma.bucketItem.findFirst({
      where: {
        id,
        userId: user.id,
      },
    })

    if (!bucketItem) {
      return NextResponse.json(
        { error: 'Bucket item not found' },
        { status: 404 }
      )
    }

    const media = await prisma.bucketMedia.findMany({
      where: {
        bucketItemId: id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(media)
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.error('Get media error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
