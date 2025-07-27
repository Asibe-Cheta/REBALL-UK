import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const certificateId = params.id;

    // Find certificate by ID
    const certificate = await prisma.certificate.findFirst({
      where: {
        // Search by the generated certificate ID pattern
        // This is a simplified search - in production you'd have a proper certificate ID field
        id: certificateId.includes('REBALL-') ? certificateId.split('-')[2] : certificateId
      },
      include: {
        user: {
          select: {
            name: true,
            firstName: true,
            lastName: true,
            profile: {
              select: {
                playerName: true,
                position: true
              }
            }
          }
        },
        course: {
          select: {
            name: true
          }
        }
      }
    });

    if (!certificate) {
      return NextResponse.json(
        { error: 'Certificate not found' },
        { status: 404 }
      );
    }

    // Get progress data for this user and course
    const progressData = await prisma.progress.findMany({
      where: {
        userId: certificate.userId,
        courseId: certificate.courseId
      },
      orderBy: {
        sessionNumber: 'asc'
      }
    });

    // Calculate improvement percentage
    const totalImprovement = progressData.reduce((sum, entry) => {
      return sum + (entry.confidenceAfter - entry.confidenceBefore);
    }, 0);

    const averageImprovement = progressData.length > 0
      ? Math.round((totalImprovement / progressData.length) * 10) / 10
      : 0;

    // Transform the certificate data
    const certificateDetails = {
      id: certificate.id,
      certificateId: `REBALL-${new Date(certificate.issuedDate).getFullYear()}-${certificate.id.slice(-6).toUpperCase()}`,
      playerName: certificate.user.profile?.playerName || certificate.user.name || `${certificate.user.firstName || ''} ${certificate.user.lastName || ''}`.trim(),
      courseName: certificate.course.name,
      completionDate: certificate.issuedDate,
      improvementPercentage: averageImprovement,
      totalSessionsCompleted: progressData.length,
      position: certificate.user.profile?.position || 'Unknown',
      coachName: 'Coach Josh', // Mock data
      issuedDate: certificate.issuedDate,
      status: 'valid' as const
    };

    return NextResponse.json({
      certificate: certificateDetails
    });

  } catch (error) {
    console.error('Error verifying certificate:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 