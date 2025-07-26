import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { videoId, watchTime, played } = body;

    if (!videoId || watchTime === undefined || played === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify user owns the video
    const video = await prisma.video.findFirst({
      where: {
        id: videoId,
        userId: session.user.id,
      },
    });

    if (!video) {
      return NextResponse.json(
        { error: 'Video not found or access denied' },
        { status: 404 }
      );
    }

    // Calculate completion rate
    const completionRate = Math.round(played * 100);

    // Update video with analytics data
    await prisma.video.update({
      where: { id: videoId },
      data: {
        // Store watch time in seconds
        watchTime: Math.floor(watchTime),
        // Update completion rate (average of existing and new)
        completionRate: completionRate,
        // Increment replay count if video was rewatched
        replayCount: {
          increment: played > 0.9 ? 1 : 0, // Count as replay if watched >90%
        },
      },
    });

    // Log analytics event (in a real app, you might store this in a separate analytics table)
    console.log('Video analytics:', {
      videoId,
      userId: session.user.id,
      watchTime,
      played,
      completionRate,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      analytics: {
        videoId,
        watchTime,
        completionRate,
        played,
      },
    });

  } catch (error) {
    console.error('Video analytics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('videoId');

    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    // Get video analytics
    const video = await prisma.video.findFirst({
      where: {
        id: videoId,
        userId: session.user.id,
      },
      select: {
        id: true,
        title: true,
        watchTime: true,
        completionRate: true,
        replayCount: true,
        createdAt: true,
      },
    });

    if (!video) {
      return NextResponse.json(
        { error: 'Video not found or access denied' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      analytics: {
        videoId: video.id,
        title: video.title,
        watchTime: video.watchTime || 0,
        completionRate: video.completionRate || 0,
        replayCount: video.replayCount || 0,
        createdAt: video.createdAt,
      },
    });

  } catch (error) {
    console.error('Error fetching video analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 