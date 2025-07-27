import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About REBALL - Football Training & 1v1 Scenario Development',
  description: 'Learn about REBALL\'s unique approach to football training. We focus on 1v1 scenarios, SISW video analysis, and position-specific training to develop confident, skilled players.',
  keywords: 'REBALL, football training, 1v1 scenarios, SISW, TAV, football coaching, player development, confidence building',
  openGraph: {
    title: 'About REBALL - Football Training & 1v1 Scenario Development',
    description: 'Learn about REBALL\'s unique approach to football training. We focus on 1v1 scenarios, SISW video analysis, and position-specific training to develop confident, skilled players.',
    type: 'website',
    url: 'https://reball.co.uk/about',
    images: [
      {
        url: '/images/og-about.jpg',
        width: 1200,
        height: 630,
        alt: 'REBALL Football Training'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About REBALL - Football Training & 1v1 Scenario Development',
    description: 'Learn about REBALL\'s unique approach to football training. We focus on 1v1 scenarios, SISW video analysis, and position-specific training to develop confident, skilled players.',
    images: ['/images/og-about.jpg']
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function AboutLayout({
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