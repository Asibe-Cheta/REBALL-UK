import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createServerSupabaseClient } from '@/lib/supabase';
import { prisma } from '@/lib/prisma';
import { VIDEO_STORAGE_PATHS } from '@/types/video';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const type = formData.get('type') as 'SISW' | 'TAV';
    const sessionNumber = parseInt(formData.get('sessionNumber') as string);
    const description = formData.get('description') as string;
    const bookingId = formData.get('bookingId') as string;

    if (!file || !title || !type || !sessionNumber) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('video/')) {
      return NextResponse.json(
        { error: 'Invalid file type. Only video files are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (500MB max)
    if (file.size > 500 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 500MB.' },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();
    const userId = session.user.id;

    // Generate unique file name
    const fileExtension = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;

    // Determine storage path based on video type
    const storagePath = type === 'SISW' ? VIDEO_STORAGE_PATHS.SISW : VIDEO_STORAGE_PATHS.TAV;
    const fullPath = `${storagePath}/${userId}/${sessionNumber}/${fileName}`;

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('reball-videos')
      .upload(fullPath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload video' },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('reball-videos')
      .getPublicUrl(fullPath);

    // Create video record in database
    const video = await prisma.video.create({
      data: {
        title,
        type,
        url: urlData.publicUrl,
        sessionNumber,
        description: description || null,
        bookingId: bookingId || null,
        userId,
        status: 'processing',
      },
    });

    // Start video processing (this would typically be done in a background job)
    // For now, we'll simulate processing
    setTimeout(async () => {
      try {
        await prisma.video.update({
          where: { id: video.id },
          data: {
            status: 'ready',
            duration: Math.floor(Math.random() * 900) + 300, // 5-15 minutes for demo
          },
        });
      } catch (error) {
        console.error('Error updating video status:', error);
      }
    }, 5000);

    return NextResponse.json({
      success: true,
      video: {
        id: video.id,
        title: video.title,
        type: video.type,
        url: video.url,
        status: video.status,
      },
    });

  } catch (error) {
    console.error('Video upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
} 