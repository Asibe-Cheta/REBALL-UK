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

    // Get certificates based on user role
    let certificates;
    
    if (user.email?.includes('coach') || user.email?.includes('admin')) {
      // Coaches and admins can see all certificates
      certificates = await prisma.certificate.findMany({
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
        },
        orderBy: {
          issuedDate: 'desc'
        }
      });
    } else {
      // Players can only see their own certificates
      certificates = await prisma.certificate.findMany({
        where: {
          userId: user.id
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
        },
        orderBy: {
          issuedDate: 'desc'
        }
      });
    }

    // Transform the data to match the expected format
    const transformedCertificates = certificates.map(cert => ({
      id: cert.id,
      playerId: cert.userId,
      courseId: cert.courseId,
      certificateUrl: cert.certificateUrl,
      certificateId: `REBALL-${new Date(cert.issuedDate).getFullYear()}-${cert.id.slice(-6).toUpperCase()}`,
      playerName: cert.user.profile?.playerName || cert.user.name || `${cert.user.firstName || ''} ${cert.user.lastName || ''}`.trim(),
      courseName: cert.course.name,
      completionDate: cert.issuedDate,
      improvementPercentage: 15, // Mock data - would be calculated from progress
      totalSessionsCompleted: 8, // Mock data - would be from progress
      position: cert.user.profile?.position || 'Unknown',
      coachName: 'Coach Josh', // Mock data
      issuedDate: cert.issuedDate,
      status: 'issued' as const
    }));

    return NextResponse.json({
      certificates: transformedCertificates
    });

  } catch (error) {
    console.error('Error fetching certificates:', error);
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
      courseId, 
      playerName, 
      courseName, 
      position, 
      improvementPercentage, 
      totalSessionsCompleted, 
      completionDate, 
      coachName 
    } = body;

    // Generate unique certificate ID
    const certificateId = `REBALL-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // Create certificate entry
    const certificate = await prisma.certificate.create({
      data: {
        userId: playerId,
        courseId: courseId,
        certificateUrl: `/certificates/${certificateId}.pdf`, // Mock URL
        issuedDate: new Date()
      },
      include: {
        user: {
          select: {
            name: true,
            firstName: true,
            lastName: true
          }
        },
        course: {
          select: {
            name: true
          }
        }
      }
    });

    // Transform the response
    const transformedCertificate = {
      id: certificate.id,
      playerId: certificate.userId,
      courseId: certificate.courseId,
      certificateUrl: certificate.certificateUrl,
      certificateId: certificateId,
      playerName: playerName,
      courseName: courseName,
      completionDate: new Date(completionDate),
      improvementPercentage: improvementPercentage,
      totalSessionsCompleted: totalSessionsCompleted,
      position: position,
      coachName: coachName,
      issuedDate: certificate.issuedDate,
      status: 'issued' as const
    };

    return NextResponse.json({ certificate: transformedCertificate });

  } catch (error) {
    console.error('Error creating certificate:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 