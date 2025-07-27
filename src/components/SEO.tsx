'use client';

import Head from 'next/head';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  structuredData?: object;
  noIndex?: boolean;
  noFollow?: boolean;
}

export default function SEO({
  title,
  description,
  keywords = 'football training, 1v1 training, REBALL, football coaching, player development, football skills',
  canonical,
  ogImage = '/images/reball-logo-black.png',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  structuredData,
  noIndex = false,
  noFollow = false
}: SEOProps) {
  const siteName = 'REBALL UK';
  const siteUrl = 'https://reball.uk';
  const fullTitle = title.includes('REBALL') ? title : `${title} | REBALL UK`;
  const fullCanonical = canonical ? `${siteUrl}${canonical}` : siteUrl;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={`${noIndex ? 'noindex' : 'index'}, ${noFollow ? 'nofollow' : 'follow'}`} />
      <link rel="canonical" href={fullCanonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_GB" />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content="@reball_uk" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />

      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#1f2937" />
      <meta name="author" content="REBALL UK" />
      <meta name="application-name" content={siteName} />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      )}
    </Head>
  );
}

// Predefined structured data schemas
export const structuredDataSchemas = {
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "REBALL UK",
    "url": "https://reball.uk",
    "logo": "https://reball.uk/images/reball-logo-black.png",
    "description": "Professional football 1v1 training and player development",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Devon",
      "addressCountry": "GB"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+44-123-456-7890",
      "contactType": "customer service",
      "email": "harry@reball.uk"
    },
    "sameAs": [
      "https://instagram.com/reball_uk",
      "https://tiktok.com/@reball.uk"
    ]
  },

  localBusiness: {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    "name": "REBALL UK",
    "description": "Professional football training facility specializing in 1v1 scenario training",
    "url": "https://reball.uk",
    "telephone": "+44-123-456-7890",
    "email": "harry@reball.uk",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Devon",
      "addressCountry": "GB"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "50.7184",
      "longitude": "-3.5339"
    },
    "openingHours": "Mo-Fr 09:00-18:00",
    "priceRange": "££",
    "currenciesAccepted": "GBP",
    "paymentAccepted": "Cash, Credit Card, Bank Transfer"
  },

  course: (courseData: any) => ({
    "@context": "https://schema.org",
    "@type": "Course",
    "name": courseData.name,
    "description": courseData.description,
    "provider": {
      "@type": "Organization",
      "name": "REBALL UK",
      "url": "https://reball.uk"
    },
    "coursePrerequisites": "Basic football skills",
    "educationalLevel": "Beginner to Advanced",
    "timeRequired": "PT8W",
    "courseMode": "in person",
    "location": {
      "@type": "Place",
      "name": "REBALL Training Facility",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Devon",
        "addressCountry": "GB"
      }
    },
    "offers": {
      "@type": "Offer",
      "price": courseData.price,
      "priceCurrency": "GBP",
      "availability": "https://schema.org/InStock"
    }
  }),

  review: (reviewData: any) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": "Organization",
      "name": "REBALL UK"
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": reviewData.rating,
      "bestRating": "5"
    },
    "author": {
      "@type": "Person",
      "name": reviewData.author
    },
    "reviewBody": reviewData.text,
    "datePublished": reviewData.date
  }),

  service: (serviceData: any) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "name": serviceData.name,
    "description": serviceData.description,
    "provider": {
      "@type": "Organization",
      "name": "REBALL UK"
    },
    "areaServed": {
      "@type": "Place",
      "name": "Devon, United Kingdom"
    },
    "serviceType": "Football Training",
    "offers": {
      "@type": "Offer",
      "price": serviceData.price,
      "priceCurrency": "GBP"
    }
  })
}; 