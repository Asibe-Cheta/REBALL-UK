'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Upload, Video, Play, Filter, Search, Plus } from 'lucide-react';
import VideoUpload from '@/components/videos/VideoUpload';
import VideoLibrary from '@/components/videos/VideoLibrary';
import VideoPlayer from '@/components/videos/VideoPlayer';
import { VideoType } from '@/types/video';

export default function VideosPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<'upload' | 'library'>('library');
  const [selectedVideo, setSelectedVideo] = useState<VideoType | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">Please sign in to access the video management system.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Video Management</h1>
              <p className="text-gray-600 mt-1">Manage SISW and TAV videos for REBALL training</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setActiveTab('upload')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Upload Video
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('library')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'library'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <Video className="w-4 h-4 inline mr-2" />
              Video Library
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'upload'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <Upload className="w-4 h-4 inline mr-2" />
              Upload Videos
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'library' ? (
          <VideoLibrary
            onVideoSelect={(video) => {
              setSelectedVideo(video);
              setIsPlayerOpen(true);
            }}
          />
        ) : (
          <VideoUpload />
        )}
      </div>

      {/* Video Player Modal */}
      {isPlayerOpen && selectedVideo && (
        <VideoPlayer
          video={selectedVideo}
          isOpen={isPlayerOpen}
          onClose={() => {
            setIsPlayerOpen(false);
            setSelectedVideo(null);
          }}
        />
      )}
    </div>
  );
} 