"use client";

export default function HeroVideo() {
  return (
    <div className="absolute inset-0 w-full h-full">
      {/* Simple video element */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0
        }}
      >
        <source src="/videos/highlight-reel-1.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-60"
        style={{ zIndex: 10 }}
      ></div>
    </div>
  );
} 