import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'REBALL Coach Video Upload - SISW & TAV Video Management',
  description: 'Professional video upload interface for REBALL coaches. Upload SISW and TAV videos with advanced processing, metadata management, and analytics tracking.',
  keywords: 'video upload, SISW videos, TAV videos, coach video management, REBALL video system, training videos',
  robots: {
    index: false,
    follow: false
  }
};

export default async function CoachUploadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Check if user is authenticated and has coach role
  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  // For now, we'll use a simple email check for coach role
  // In production, you'd want a proper role system
  const isCoach = session.user.email.includes('coach') || session.user.email.includes('admin');

  if (!isCoach) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
} 