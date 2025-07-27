import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard | REBALL',
  description: 'Comprehensive admin dashboard for REBALL platform management and oversight.',
  keywords: 'admin dashboard, platform management, user management, financial analytics, system administration, REBALL',
  openGraph: {
    title: 'Admin Dashboard | REBALL',
    description: 'Comprehensive admin dashboard for REBALL platform management and oversight.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Admin Dashboard | REBALL',
    description: 'Comprehensive admin dashboard for REBALL platform management and oversight.',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  // Check if user is authenticated
  if (!session) {
    redirect('/auth/signin');
  }

  // Check if user is an admin (mocked by email pattern)
  const userEmail = session.user?.email || '';
  const isAdmin = userEmail.includes('admin') || userEmail.includes('harry') || userEmail.includes('reball');

  if (!isAdmin) {
    redirect('/dashboard');
  }

  return (
    <div>
      {children}
    </div>
  );
} 