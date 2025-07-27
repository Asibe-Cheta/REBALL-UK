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

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');

    // Get users based on role filter
    let users;
    if (role) {
      // For now, we'll filter by email pattern since we don't have a role field
      // In a real implementation, you'd have a role field in the User model
      if (role === 'player') {
        users = await prisma.user.findMany({
          where: {
            email: {
              not: {
                contains: 'coach'
              }
            }
          },
          select: {
            id: true,
            name: true,
            email: true,
            firstName: true,
            lastName: true
          }
        });
      } else if (role === 'coach') {
        users = await prisma.user.findMany({
          where: {
            email: {
              contains: 'coach'
            }
          },
          select: {
            id: true,
            name: true,
            email: true,
            firstName: true,
            lastName: true
          }
        });
      } else {
        users = await prisma.user.findMany({
          select: {
            id: true,
            name: true,
            email: true,
            firstName: true,
            lastName: true
          }
        });
      }
    } else {
      users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          firstName: true,
          lastName: true
        }
      });
    }

    // Format user names
    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
      email: user.email,
      role: user.email?.includes('coach') ? 'coach' : 'player'
    }));

    return NextResponse.json({
      users: formattedUsers
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 