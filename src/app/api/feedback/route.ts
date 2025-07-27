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
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get feedback data
    let feedbackData;
    
    // If user is admin or coach, get all feedback
    // If user is player, get only their feedback
    if (user.email?.includes('coach') || user.email?.includes('admin')) {
      feedbackData = await prisma.progress.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
    } else {
      feedbackData = await prisma.progress.findMany({
        where: {
          userId: user.id
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    }

    return NextResponse.json({
      feedback: feedbackData
    });

  } catch (error) {
    console.error('Error fetching feedback data:', error);
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
    const { 
      playerId, 
      sessionNumber, 
      confidenceBefore, 
      confidenceAfter, 
      scenario, 
      feedback, 
      strengths, 
      actionItems, 
      rating 
    } = body;

    // Get coach user
    const coach = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!coach) {
      return NextResponse.json({ error: 'Coach not found' }, { status: 404 });
    }

    // Create new feedback entry
    const feedbackEntry = await prisma.progress.create({
      data: {
        userId: playerId,
        courseId: 'default-course-id', // You might want to get this from the request
        scenario,
        confidenceBefore,
        confidenceAfter,
        sessionNumber,
        feedback
      }
    });

    return NextResponse.json({ feedback: feedbackEntry });

  } catch (error) {
    console.error('Error creating feedback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      id, 
      confidenceBefore, 
      confidenceAfter, 
      scenario, 
      feedback, 
      strengths, 
      actionItems, 
      rating 
    } = body;

    // Update feedback entry
    const updatedFeedback = await prisma.progress.update({
      where: { id },
      data: {
        confidenceBefore,
        confidenceAfter,
        scenario,
        feedback,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({ feedback: updatedFeedback });

  } catch (error) {
    console.error('Error updating feedback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Feedback ID required' }, { status: 400 });
    }

    // Delete feedback entry
    await prisma.progress.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting feedback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 