import { createServerSupabaseClient } from './supabase';
import { prisma } from './prisma';
import { VIDEO_STORAGE_PATHS } from '@/types/video';

export interface VideoProcessingJob {
  videoId: string;
  filePath: string;
  userId: string;
  sessionNumber: number;
  type: 'SISW' | 'TAV';
}

export class VideoProcessingService {
  private supabase = createServerSupabaseClient();

  async processVideo(job: VideoProcessingJob) {
    try {
      console.log(`Starting video processing for video ${job.videoId}`);

      // Update status to processing
      await prisma.video.update({
        where: { id: job.videoId },
        data: { status: 'processing' },
      });

      // Step 1: Generate thumbnail
      const thumbnailUrl = await this.generateThumbnail(job);

      // Step 2: Generate multiple quality variants
      const qualityUrls = await this.generateQualityVariants(job);

      // Step 3: Update video record with processed data
      await prisma.video.update({
        where: { id: job.videoId },
        data: {
          status: 'ready',
          thumbnail: thumbnailUrl,
          qualities: qualityUrls,
        },
      });

      console.log(`Video processing completed for video ${job.videoId}`);
      return true;

    } catch (error) {
      console.error(`Video processing failed for video ${job.videoId}:`, error);

      // Update status to error
      await prisma.video.update({
        where: { id: job.videoId },
        data: {
          status: 'error',
          errorMessage: error instanceof Error ? error.message : 'Processing failed',
        },
      });

      return false;
    }
  }

  private async generateThumbnail(job: VideoProcessingJob): Promise<string> {
    // In a real implementation, you would use FFmpeg to extract a frame
    // For now, we'll create a placeholder thumbnail
    const thumbnailPath = `${VIDEO_STORAGE_PATHS.THUMBNAILS}/${job.videoId}.jpg`;

    // Create a simple placeholder image (in production, extract from video)
    const placeholderImage = this.createPlaceholderThumbnail();

    const { data, error } = await this.supabase.storage
      .from('reball-videos')
      .upload(thumbnailPath, placeholderImage, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (error) {
      throw new Error(`Failed to upload thumbnail: ${error.message}`);
    }

    const { data: urlData } = this.supabase.storage
      .from('reball-videos')
      .getPublicUrl(thumbnailPath);

    return urlData.publicUrl;
  }

  private async generateQualityVariants(job: VideoProcessingJob): Promise<Record<string, string>> {
    const qualities = ['480p', '720p', '1080p'];
    const qualityUrls: Record<string, string> = {};

    for (const quality of qualities) {
      try {
        const qualityPath = `${job.filePath.replace('.mp4', '')}_${quality}.mp4`;

        // In a real implementation, you would use FFmpeg to transcode
        // For now, we'll use the original URL for all qualities
        const { data: urlData } = this.supabase.storage
          .from('reball-videos')
          .getPublicUrl(job.filePath);

        qualityUrls[quality] = urlData.publicUrl;
      } catch (error) {
        console.error(`Failed to generate ${quality} variant:`, error);
      }
    }

    return qualityUrls;
  }

  private createPlaceholderThumbnail(): Blob {
    // Create a simple canvas-based placeholder
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 180;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Create a gradient background
      const gradient = ctx.createLinearGradient(0, 0, 320, 180);
      gradient.addColorStop(0, '#1f2937');
      gradient.addColorStop(1, '#374151');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 320, 180);

      // Add play button icon
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(140, 80);
      ctx.lineTo(140, 120);
      ctx.lineTo(180, 100);
      ctx.closePath();
      ctx.fill();
    }

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, 'image/jpeg', 0.8);
    });
  }

  async getVideoDuration(filePath: string): Promise<number> {
    // In a real implementation, you would use FFmpeg to get duration
    // For now, return a random duration between 5-15 minutes
    return Math.floor(Math.random() * 600) + 300;
  }

  async cleanupProcessingFiles(videoId: string) {
    try {
      // Clean up temporary processing files
      const { data, error } = await this.supabase.storage
        .from('reball-videos')
        .remove([`temp/${videoId}`]);

      if (error) {
        console.error('Failed to cleanup processing files:', error);
      }
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }
}

// Export singleton instance
export const videoProcessingService = new VideoProcessingService(); 