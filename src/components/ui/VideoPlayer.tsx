"use client";

import { useState } from "react";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  controls?: boolean;
  className?: string;
  fallbackTitle?: string;
  fallbackDescription?: string;
}

export default function VideoPlayer({
  src,
  poster,
  controls = true,
  className = "",
  fallbackTitle = "Video Content",
  fallbackDescription = "Video content coming soon"
}: VideoPlayerProps) {
  const [videoError, setVideoError] = useState(false);

  const handleVideoError = () => {
    console.log(`Video failed to load: ${src}`);
    setVideoError(true);
  };

  if (videoError) {
    return (
      <div className={`w-full aspect-video bg-gradient-to-br from-black-dark to-black-accent rounded-lg flex items-center justify-center relative overflow-hidden ${className}`}>
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white to-transparent transform -skew-x-12 -translate-x-full animate-pulse"></div>
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-white to-transparent transform skew-x-12 translate-x-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center p-8">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>

          <h3 className="text-white text-2xl mb-3">{fallbackTitle}</h3>
          <p className="text-white-text max-w-md mx-auto">{fallbackDescription}</p>

          <div className="mt-6">
            <div className="inline-flex items-center px-4 py-2 bg-white text-black rounded-lg font-semibold hover:bg-white-off transition-colors">
              <span className="mr-2">Coming Soon</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Football field pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-gradient-to-b from-transparent via-white to-transparent"></div>
          <div className="absolute top-1/2 left-0 right-0 h-px bg-white"></div>
          <div className="absolute top-1/2 left-1/2 w-16 h-16 border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <video
      controls={controls}
      className={`w-full aspect-video ${className}`}
      poster={poster}
      onError={handleVideoError}
    >
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
} 