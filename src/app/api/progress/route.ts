import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        bookings: {
          include: {
            course: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get progress data for the user
    const progressData = await prisma.progress.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Get course data (assuming user has an active course)
    const activeBooking = user.bookings.find(booking =>
      booking.status === 'confirmed' || booking.status === 'completed'
    );

    const courseData = activeBooking?.course || null;

    // Get videos associated with progress
    const videos = await prisma.video.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      progress: progressData,
      course: courseData,
      videos: videos
    });

  } catch (error) {
    console.error('Error fetching progress data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { courseId, scenario, confidenceBefore, confidenceAfter, sessionNumber, feedback } = body;

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create new progress entry
    const progress = await prisma.progress.create({
      data: {
        userId: user.id,
        courseId,
        scenario,
        confidenceBefore,
        confidenceAfter,
        sessionNumber,
        feedback
      }
    });

    return NextResponse.json({ progress });

  } catch (error) {
    console.error('Error creating progress entry:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 