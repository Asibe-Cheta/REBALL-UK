'use client';

import Image from 'next/image';
import { useState } from 'react';


interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 75,
  placeholder = 'empty',
  blurDataURL
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{ width, height }}
        />
      )}

      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        priority={priority}
        sizes={sizes}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </div>
  );
}

// Predefined image sizes for common use cases
export const imageSizes = {
  hero: '(max-width: 768px) 100vw, 1200px',
  card: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px',
  thumbnail: '(max-width: 768px) 100vw, 300px',
  avatar: '100px',
  logo: '200px'
};

// Common image configurations
export const imageConfigs = {
  hero: {
    quality: 85,
    priority: true,
    placeholder: 'blur' as const
  },
  card: {
    quality: 75,
    priority: false,
    placeholder: 'empty' as const
  },
  thumbnail: {
    quality: 70,
    priority: false,
    placeholder: 'empty' as const
  }
}; 