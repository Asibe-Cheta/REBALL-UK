export default function TestVideo() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="max-w-4xl w-full">
        <h1 className="text-white text-2xl mb-4">Video Test Page</h1>
        
        <div className="bg-gray-800 p-4 rounded mb-4">
          <h2 className="text-white mb-2">Hero Background Video Test</h2>
          <video
            controls
            className="w-full max-w-md"
            preload="metadata"
          >
            <source src="/videos/hero-background.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-white mb-2">Direct Video Link</h2>
          <a 
            href="/videos/hero-background.mp4" 
            target="_blank"
            className="text-blue-400 hover:text-blue-300"
          >
            Open video in new tab
          </a>
        </div>
      </div>
    </div>
  );
} 