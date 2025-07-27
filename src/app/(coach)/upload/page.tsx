'use client';

import { useState, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import {
  Upload,
  Video,
  Users,
  Calendar,
  FileText,
  Play,
  Pause,
  Trash2,
  Edit,
  Eye,
  CheckCircle,
  AlertCircle,
  Clock,
  HardDrive,
  Mic,
  Type,
  Tag,
  Folder,
  Search,
  Filter,
  Download,
  Share,
  Settings,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Plus,
  X,
  ChevronDown,
  ChevronRight,
  Star,
  BarChart3,
  TrendingUp,
  Volume2,
  Image,
  Scissors,
  RotateCcw
} from 'lucide-react';

interface Player {
  id: string;
  name: string;
  email: string;
  position: string;
  course: string;
  progress: number;
}

interface VideoUpload {
  id: string;
  playerName: string;
  playerId: string;
  sessionNumber: number;
  videoType: 'SISW' | 'TAV' | 'Training Highlight' | 'Assessment';
  title: string;
  description: string;
  fileName: string;
  fileSize: number;
  duration: number;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  progress: number;
  uploadDate: string;
  thumbnail?: string;
  focusAreas: string[];
  learningPoints: string[];
  improvementAreas: string[];
  strengths: string[];
}

interface UploadStats {
  totalUploads: number;
  completedUploads: number;
  failedUploads: number;
  storageUsed: number;
  storageLimit: number;
  averageFileSize: number;
}

export default function CoachVideoUpload() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<'upload' | 'queue' | 'library' | 'analytics'>('upload');
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [selectedSession, setSelectedSession] = useState('');
  const [selectedVideoType, setSelectedVideoType] = useState<'SISW' | 'TAV' | 'Training Highlight' | 'Assessment'>('SISW');
  const [uploadQueue, setUploadQueue] = useState<VideoUpload[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadStats, setUploadStats] = useState<UploadStats>({
    totalUploads: 45,
    completedUploads: 42,
    failedUploads: 3,
    storageUsed: 15.2,
    storageLimit: 50,
    averageFileSize: 245
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock data
  const players: Player[] = [
    { id: '1', name: 'Alex Thompson', email: 'alex@example.com', position: 'Striker', course: '1v1 Attacking Finishing', progress: 75 },
    { id: '2', name: 'Emma Rodriguez', email: 'emma@example.com', position: 'Winger', course: '1v1 Attacking Crossing', progress: 60 },
    { id: '3', name: 'David Chen', email: 'david@example.com', position: 'CAM', course: '1v1 Attacking Finishing', progress: 90 }
  ];

  const videoTypes = [
    { id: 'SISW', name: 'SISW (Session in Slow-motion with Voiceover)', description: 'Detailed analysis with coach commentary' },
    { id: 'TAV', name: 'TAV (Technical Analysis Videos)', description: 'Match of the Day style analysis' },
    { id: 'Training Highlight', name: 'Training Highlight', description: 'General training footage' },
    { id: 'Assessment', name: 'Assessment', description: 'Skills assessment video' }
  ];

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFiles = (files: FileList) => {
    Array.from(files).forEach(file => {
      if (file.type.startsWith('video/')) {
        const newUpload: VideoUpload = {
          id: Date.now().toString(),
          playerName: players.find(p => p.id === selectedPlayer)?.name || 'Unknown Player',
          playerId: selectedPlayer,
          sessionNumber: parseInt(selectedSession) || 1,
          videoType: selectedVideoType,
          title: `Session ${selectedSession} - ${selectedVideoType}`,
          description: '',
          fileName: file.name,
          fileSize: file.size,
          duration: 0, // Would be calculated from video metadata
          status: 'uploading',
          progress: 0,
          uploadDate: new Date().toISOString(),
          focusAreas: [],
          learningPoints: [],
          improvementAreas: [],
          strengths: []
        };

        setUploadQueue(prev => [...prev, newUpload]);
        simulateUpload(newUpload.id);
      }
    });
  };

  const simulateUpload = (uploadId: string) => {
    setIsUploading(true);
    let progress = 0;

    const interval = setInterval(() => {
      progress += Math.random() * 15;

      setUploadQueue(prev => prev.map(upload =>
        upload.id === uploadId
          ? { ...upload, progress: Math.min(progress, 100) }
          : upload
      ));

      if (progress >= 100) {
        clearInterval(interval);
        setUploadQueue(prev => prev.map(upload =>
          upload.id === uploadId
            ? { ...upload, status: 'processing', progress: 100 }
            : upload
        ));

        // Simulate processing completion
        setTimeout(() => {
          setUploadQueue(prev => prev.map(upload =>
            upload.id === uploadId
              ? { ...upload, status: 'completed' }
              : upload
          ));
          setIsUploading(false);
        }, 2000);
      }
    }, 500);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeUpload = (uploadId: string) => {
    setUploadQueue(prev => prev.filter(upload => upload.id !== uploadId));
  };

  const getStoragePercentage = () => {
    return (uploadStats.storageUsed / uploadStats.storageLimit) * 100;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Video className="w-8 h-8 text-blue-500" />
              <h1 className="text-2xl font-bold text-gray-900">Video Upload Center</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <HardDrive className="w-4 h-4" />
                <span>{uploadStats.storageUsed}GB / {uploadStats.storageLimit}GB</span>
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${getStoragePercentage()}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'upload', label: 'Upload Videos', icon: Upload },
              { id: 'queue', label: 'Upload Queue', icon: Clock },
              { id: 'library', label: 'Video Library', icon: Video },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="space-y-6">
            {/* Upload Dashboard Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <Upload className="w-8 h-8 text-blue-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-600">Total Uploads</p>
                    <p className="text-2xl font-bold text-blue-900">{uploadStats.totalUploads}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-600">Completed</p>
                    <p className="text-2xl font-bold text-green-900">{uploadStats.completedUploads}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-600">Failed</p>
                    <p className="text-2xl font-bold text-red-900">{uploadStats.failedUploads}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <HardDrive className="w-8 h-8 text-purple-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-purple-600">Avg File Size</p>
                    <p className="text-2xl font-bold text-purple-900">{uploadStats.averageFileSize}MB</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Upload Form */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Upload New Video</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Player *
                  </label>
                  <select
                    value={selectedPlayer}
                    onChange={(e) => setSelectedPlayer(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Choose a player</option>
                    {players.map((player) => (
                      <option key={player.id} value={player.id}>
                        {player.name} - {player.course}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Number *
                  </label>
                  <select
                    value={selectedSession}
                    onChange={(e) => setSelectedSession(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select session</option>
                    {Array.from({ length: 8 }, (_, i) => i + 1).map((session) => (
                      <option key={session} value={session.toString()}>
                        Session {session}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video Type *
                  </label>
                  <select
                    value={selectedVideoType}
                    onChange={(e) => setSelectedVideoType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {videoTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video Quality
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="1080p">1080p (Recommended)</option>
                    <option value="720p">720p</option>
                    <option value="480p">480p</option>
                  </select>
                </div>
              </div>

              {/* File Upload System */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Video File *
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                    }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Drop your video file here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Supports MP4, MOV, AVI • Max 2GB • {selectedVideoType === 'SISW' ? '5-15 min' : '10-20 min'} duration
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Choose File
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    multiple
                  />
                </div>
              </div>

              {/* Video Metadata Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video Title
                  </label>
                  <input
                    type="text"
                    placeholder="Auto-generated or custom title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Detailed description of video content..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session Focus Areas
                    </label>
                    <textarea
                      rows={2}
                      placeholder="What 1v1 scenarios are covered..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Key Learning Points
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Main takeaways for the player..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Improvement Areas
                    </label>
                    <textarea
                      rows={2}
                      placeholder="What the player should focus on..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Strengths Highlighted
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Positive aspects to reinforce..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Processing Options */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-md font-semibold text-gray-900 mb-4">Processing Options</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span className="text-sm text-gray-700">Auto-optimize video quality</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-700">Generate thumbnail</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-700">Add REBALL watermark</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Queue Tab */}
        {activeTab === 'queue' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Upload Queue</h2>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                    Pause All
                  </button>
                  <button className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">
                    Resume All
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {uploadQueue.map((upload) => (
                  <div key={upload.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Video className="w-6 h-6 text-gray-500" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{upload.title}</h4>
                          <p className="text-sm text-gray-600">
                            {upload.playerName} • Session {upload.sessionNumber} • {upload.videoType}
                          </p>
                          <p className="text-sm text-gray-500">
                            {(upload.fileSize / 1024 / 1024).toFixed(1)}MB • {upload.fileName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            {upload.status === 'uploading' && <Clock className="w-4 h-4 text-blue-500" />}
                            {upload.status === 'processing' && <BarChart3 className="w-4 h-4 text-yellow-500" />}
                            {upload.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-500" />}
                            {upload.status === 'failed' && <AlertCircle className="w-4 h-4 text-red-500" />}
                            <span className={`text-sm font-medium ${upload.status === 'uploading' ? 'text-blue-600' :
                                upload.status === 'processing' ? 'text-yellow-600' :
                                  upload.status === 'completed' ? 'text-green-600' :
                                    'text-red-600'
                              }`}>
                              {upload.status}
                            </span>
                          </div>
                          {upload.status === 'uploading' && (
                            <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${upload.progress}%` }}
                              ></div>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          {upload.status === 'uploading' && (
                            <button className="p-2 text-gray-400 hover:text-gray-600">
                              <Pause className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => removeUpload(upload.id)}
                            className="p-2 text-red-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {uploadQueue.length === 0 && (
                  <div className="text-center py-8">
                    <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No videos in upload queue</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Video Library Tab */}
        {activeTab === 'library' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Video Library</h2>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search videos..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>All Types</option>
                    <option>SISW</option>
                    <option>TAV</option>
                    <option>Training Highlight</option>
                    <option>Assessment</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {uploadQueue.filter(upload => upload.status === 'completed').map((upload) => (
                  <div key={upload.id} className="border rounded-lg overflow-hidden">
                    <div className="aspect-video bg-gray-200 flex items-center justify-center">
                      <Play className="w-12 h-12 text-gray-400" />
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">{upload.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {upload.playerName} • Session {upload.sessionNumber}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{upload.videoType}</span>
                        <div className="flex items-center space-x-2">
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <Share className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Statistics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Uploads</span>
                    <span className="font-semibold">{uploadStats.totalUploads}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Success Rate</span>
                    <span className="font-semibold text-green-600">
                      {Math.round((uploadStats.completedUploads / uploadStats.totalUploads) * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Storage Used</span>
                    <span className="font-semibold">{uploadStats.storageUsed}GB</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Video Performance</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Views</span>
                    <span className="font-semibold">1,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Watch Time</span>
                    <span className="font-semibold">8.5 min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completion Rate</span>
                    <span className="font-semibold text-green-600">78%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Content</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">SISW Videos</span>
                    <span className="font-semibold">65%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">TAV Videos</span>
                    <span className="font-semibold">25%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Training Highlights</span>
                    <span className="font-semibold">10%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 