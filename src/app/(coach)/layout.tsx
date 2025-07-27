import type { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'REBALL Coach Dashboard - Player Management & Training Tools',
  description: 'Comprehensive coach dashboard for managing players, sessions, feedback, and training analytics. Access to REBALL coaching tools and player development tracking.',
  keywords: 'coach dashboard, player management, training sessions, feedback system, video uploads, coaching analytics, REBALL coaching tools',
  robots: {
    index: false,
    follow: false
  }
};

export default async function CoachLayout({
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