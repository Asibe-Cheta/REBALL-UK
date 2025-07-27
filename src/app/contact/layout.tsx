import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact REBALL - Football Training & 1v1 Coaching Support',
  description: 'Get in touch with REBALL for football training inquiries, course bookings, technical support, and partnership opportunities. We respond within 24 hours.',
  keywords: 'contact REBALL, football training contact, 1v1 coaching support, course booking, technical support, partnership opportunities',
  openGraph: {
    title: 'Contact REBALL - Football Training & 1v1 Coaching Support',
    description: 'Get in touch with REBALL for football training inquiries, course bookings, technical support, and partnership opportunities. We respond within 24 hours.',
    type: 'website',
    url: 'https://reball.co.uk/contact',
    images: [
      {
        url: '/images/og-contact.jpg',
        width: 1200,
        height: 630,
        alt: 'Contact REBALL Football Training'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact REBALL - Football Training & 1v1 Coaching Support',
    description: 'Get in touch with REBALL for football training inquiries, course bookings, technical support, and partnership opportunities. We respond within 24 hours.',
    images: ['/images/og-contact.jpg']
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
} 