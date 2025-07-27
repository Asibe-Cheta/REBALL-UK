import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Player Management | REBALL',
  description: 'Comprehensive player management interface for REBALL coaches to track and manage assigned players.',
  keywords: 'player management, coach dashboard, football training, REBALL, player progress, session management',
  openGraph: {
    title: 'Player Management | REBALL',
    description: 'Comprehensive player management interface for REBALL coaches to track and manage assigned players.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Player Management | REBALL',
    description: 'Comprehensive player management interface for REBALL coaches to track and manage assigned players.',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function PlayersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  // Check if user is authenticated
  if (!session) {
    redirect('/auth/signin');
  }

  // Check if user is a coach or admin (mocked by email pattern)
  const userEmail = session.user?.email || '';
  const isCoach = userEmail.includes('coach') || userEmail.includes('admin') || userEmail.includes('harry');

  if (!isCoach) {
    redirect('/dashboard');
  }

  return (
    <div>
      {children}
    </div>
  );
} 