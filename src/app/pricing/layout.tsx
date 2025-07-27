import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'REBALL Pricing - Football Training Packages & 1v1 Coaching',
  description: 'Transparent pricing for REBALL football training. Choose from group or 1v1 training packages with SISW and TAV video analysis. No hidden fees, proven results.',
  keywords: 'REBALL pricing, football training cost, 1v1 coaching price, group training packages, SISW video analysis, TAV videos, football coaching fees',
  openGraph: {
    title: 'REBALL Pricing - Football Training Packages & 1v1 Coaching',
    description: 'Transparent pricing for REBALL football training. Choose from group or 1v1 training packages with SISW and TAV video analysis. No hidden fees, proven results.',
    type: 'website',
    url: 'https://reball.co.uk/pricing',
    images: [
      {
        url: '/images/og-pricing.jpg',
        width: 1200,
        height: 630,
        alt: 'REBALL Football Training Pricing'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'REBALL Pricing - Football Training Packages & 1v1 Coaching',
    description: 'Transparent pricing for REBALL football training. Choose from group or 1v1 training packages with SISW and TAV video analysis. No hidden fees, proven results.',
    images: ['/images/og-pricing.jpg']
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function PricingLayout({
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