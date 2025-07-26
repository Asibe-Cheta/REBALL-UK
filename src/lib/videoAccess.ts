import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { prisma } from './prisma';

export interface VideoAccessLevel {
  canViewSISW: boolean;
  canViewTAV: boolean;
  canUpload: boolean;
  canDownload: boolean;
}

export async function getUserVideoAccess(userId: string): Promise<VideoAccessLevel> {
  try {
    // Get user's active booking with highest package level
    const activeBooking = await prisma.booking.findFirst({
      where: {
        userId,
        status: 'confirmed',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!activeBooking) {
      return {
        canViewSISW: false,
        canViewTAV: false,
        canUpload: false,
        canDownload: false,
      };
    }

    // Determine access based on package type
    switch (activeBooking.packageType) {
      case 'training-sisw-tav':
        return {
          canViewSISW: true,
          canViewTAV: true,
          canUpload: false, // Only coaches can upload
          canDownload: false,
        };

      case 'training-sisw':
        return {
          canViewSISW: true,
          canViewTAV: false,
          canUpload: false,
          canDownload: false,
        };

      case 'training':
      default:
        return {
          canViewSISW: false,
          canViewTAV: false,
          canUpload: false,
          canDownload: false,
        };
    }
  } catch (error) {
    console.error('Error getting user video access:', error);
    return {
      canViewSISW: false,
      canViewTAV: false,
      canUpload: false,
      canDownload: false,
    };
  }
}

export async function canUserAccessVideo(userId: string, videoType: 'SISW' | 'TAV'): Promise<boolean> {
  const access = await getUserVideoAccess(userId);

  if (videoType === 'SISW') {
    return access.canViewSISW;
  } else if (videoType === 'TAV') {
    return access.canViewTAV;
  }

  return false;
}

export async function canUserUploadVideo(userId: string): Promise<boolean> {
  const access = await getUserVideoAccess(userId);
  return access.canUpload;
}

export async function isCoach(userId: string): Promise<boolean> {
  // In a real implementation, you would check user role
  // For now, we'll assume coaches have a specific email domain or role
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });

  if (!user) return false;

  // Check if user is a coach (example: coaches have @reball.co.uk emails)
  return user.email?.includes('@reball.co.uk') || false;
}

export async function getSessionVideoAccess(): Promise<VideoAccessLevel> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return {
      canViewSISW: false,
      canViewTAV: false,
      canUpload: false,
      canDownload: false,
    };
  }

  return await getUserVideoAccess(session.user.id);
}

export function filterVideosByAccess(videos: any[], access: VideoAccessLevel) {
  return videos.filter(video => {
    if (video.type === 'SISW') {
      return access.canViewSISW;
    } else if (video.type === 'TAV') {
      return access.canViewTAV;
    }
    return false;
  });
}

export async function validateVideoAccess(videoId: string, userId: string): Promise<boolean> {
  try {
    const video = await prisma.video.findFirst({
      where: {
        id: videoId,
        userId,
      },
      select: {
        type: true,
      },
    });

    if (!video) {
      return false;
    }

    return await canUserAccessVideo(userId, video.type as 'SISW' | 'TAV');
  } catch (error) {
    console.error('Error validating video access:', error);
    return false;
  }
} 