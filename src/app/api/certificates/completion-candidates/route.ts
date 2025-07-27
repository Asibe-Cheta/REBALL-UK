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

    // Get all users with their progress data
    const usersWithProgress = await prisma.user.findMany({
      include: {
        progress: {
          include: {
            course: true
          },
          orderBy: {
            sessionNumber: 'asc'
          }
        },
        profile: {
          select: {
            playerName: true,
            position: true
          }
        },
        bookings: {
          where: {
            status: 'confirmed'
          },
          include: {
            course: true
          }
        }
      }
    });

    const candidates: any[] = [];

    // Check each user for completion criteria
    for (const user of usersWithProgress) {
      // Group progress by course
      const progressByCourse = user.progress.reduce((acc, progress) => {
        if (!acc[progress.courseId]) {
          acc[progress.courseId] = [];
        }
        acc[progress.courseId].push(progress);
        return acc;
      }, {} as Record<string, any[]>);

      // Check each course for completion
      for (const [courseId, progressEntries] of Object.entries(progressByCourse)) {
        const course = progressEntries[0]?.course;
        if (!course) continue;

        // Check if user has completed 8 sessions for this course
        const sessionsCompleted = progressEntries.length;
        
        if (sessionsCompleted >= 8) {
          // Calculate improvement percentage
          const totalImprovement = progressEntries.reduce((sum, entry) => {
            return sum + (entry.confidenceAfter - entry.confidenceBefore);
          }, 0);
          
          const averageImprovement = Math.round((totalImprovement / sessionsCompleted) * 10) / 10;

          // Check if certificate already exists
          const existingCertificate = await prisma.certificate.findFirst({
            where: {
              userId: user.id,
              courseId: courseId
            }
          });

          if (!existingCertificate) {
            candidates.push({
              playerId: user.id,
              playerName: user.profile?.playerName || user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
              courseId: courseId,
              courseName: course.name,
              sessionsCompleted: sessionsCompleted,
              improvementPercentage: averageImprovement,
              position: user.profile?.position || 'Unknown',
              coachName: 'Coach Josh', // Mock data
              completionDate: new Date()
            });
          }
        }
      }
    }

    return NextResponse.json({
      candidates: candidates
    });

  } catch (error) {
    console.error('Error fetching completion candidates:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 