import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const sessionNumber = searchParams.get('sessionNumber');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Build where clause
    const where: any = {
      userId: session.user.id,
    };

    if (type) {
      where.type = type;
    }

    if (sessionNumber) {
      where.sessionNumber = parseInt(sessionNumber);
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const videos = await prisma.video.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        booking: {
          include: {
            course: true,
          },
        },
      },
    });

    // Transform videos to include additional fields
    const transformedVideos = videos.map(video => ({
      id: video.id,
      title: video.title,
      type: video.type,
      url: video.url,
      thumbnail: video.thumbnail,
      duration: video.duration,
      sessionNumber: video.sessionNumber,
      description: video.description,
      status: video.status,
      userId: video.userId,
      bookingId: video.bookingId,
      createdAt: video.createdAt,
      updatedAt: video.updatedAt,
      // Add access level based on booking package
      accessLevel: video.booking?.packageType || 'training',
      // Add analytics (mock data for now)
      watchTime: Math.floor(Math.random() * 600), // 0-10 minutes
      completionRate: Math.floor(Math.random() * 100),
      replayCount: Math.floor(Math.random() * 5),
    }));

    return NextResponse.json({
      videos: transformedVideos,
      total: transformedVideos.length,
    });

  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
} 