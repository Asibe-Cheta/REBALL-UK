export interface VideoType {
  id: string;
  title: string;
  type: 'SISW' | 'TAV';
  url: string;
  thumbnail?: string;
  duration?: number;
  sessionNumber?: number;
  userId: string;
  bookingId?: string;
  description?: string;
  status: 'processing' | 'ready' | 'error';
  createdAt: Date;
  updatedAt: Date;
  // Access control
  accessLevel: 'training' | 'training-sisw' | 'training-sisw-tav';
  // Analytics
  watchTime?: number;
  completionRate?: number;
  replayCount?: number;
  // Quality variants
  qualities?: {
    '480p'?: string;
    '720p'?: string;
    '1080p'?: string;
  };
  // Processing metadata
  processingProgress?: number;
  errorMessage?: string;
}

export interface VideoUploadData {
  title: string;
  type: 'SISW' | 'TAV';
  sessionNumber: number;
  description?: string;
  bookingId?: string;
  file: File;
}

export interface VideoFilter {
  type?: 'SISW' | 'TAV';
  sessionNumber?: number;
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
  status?: 'processing' | 'ready' | 'error';
}

export interface VideoAnalytics {
  videoId: string;
  watchTime: number;
  completionRate: number;
  replayCount: number;
  popularSections: Array<{
    startTime: number;
    endTime: number;
    replayCount: number;
  }>;
  lastWatchedAt?: Date;
}

export interface VideoProcessingStatus {
  videoId: string;
  status: 'uploading' | 'processing' | 'ready' | 'error';
  progress: number;
  currentStep: string;
  errorMessage?: string;
}

// Supabase Storage paths
export const VIDEO_STORAGE_PATHS = {
  SISW: 'sisw-videos',
  TAV: 'tav-videos',
  THUMBNAILS: 'thumbnails',
} as const;

export const VIDEO_QUALITIES = ['480p', '720p', '1080p'] as const;
export const VIDEO_TYPES = ['SISW', 'TAV'] as const;
export const SESSION_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8] as const; 