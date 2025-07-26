'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useSession } from 'next-auth/react';
import { Upload, X, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { VideoUploadData, VideoType, VIDEO_TYPES, SESSION_NUMBERS } from '@/types/video';

interface VideoUploadProps { }

export default function VideoUpload({ }: VideoUploadProps) {
  const { data: session } = useSession();
  const [uploadData, setUploadData] = useState<VideoUploadData | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];

      // Validate file type
      if (!file.type.startsWith('video/')) {
        setErrorMessage('Please select a valid video file');
        return;
      }

      // Validate file size (max 500MB)
      if (file.size > 500 * 1024 * 1024) {
        setErrorMessage('File size must be less than 500MB');
        return;
      }

      setUploadData({
        title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
        type: 'SISW',
        sessionNumber: 1,
        description: '',
        file: file,
      });
      setErrorMessage('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.mkv', '.webm']
    },
    multiple: false,
    maxSize: 500 * 1024 * 1024, // 500MB
  });

  const handleUpload = async () => {
    if (!uploadData || !session?.user) return;

    setUploadStatus('uploading');
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', uploadData.file);
      formData.append('title', uploadData.title);
      formData.append('type', uploadData.type);
      formData.append('sessionNumber', uploadData.sessionNumber.toString());
      formData.append('description', uploadData.description || '');
      formData.append('bookingId', uploadData.bookingId || '');

      const response = await fetch('/api/videos/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      setUploadStatus('success');
      setUploadProgress(100);

      // Reset form after successful upload
      setTimeout(() => {
        setUploadData(null);
        setUploadStatus('idle');
        setUploadProgress(0);
      }, 2000);

    } catch (error) {
      setUploadStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Upload failed');
    }
  };

  const resetUpload = () => {
    setUploadData(null);
    setUploadStatus('idle');
    setUploadProgress(0);
    setErrorMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Upload Video</h2>
          <p className="text-sm text-gray-600 mt-1">
            Upload SISW or TAV videos for REBALL training sessions
          </p>
        </div>

        <div className="p-6">
          {/* Upload Area */}
          <div className="mb-6">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
                }`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <p className="text-lg font-medium text-gray-900">
                  {isDragActive ? 'Drop the video here' : 'Drag & drop video file'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  or click to select a file
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Supports MP4, MOV, AVI, MKV, WebM (max 500MB)
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <p className="ml-3 text-sm text-red-800">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {uploadStatus === 'uploading' && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Uploading...</span>
                <span className="text-sm text-gray-500">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Success Message */}
          {uploadStatus === 'success' && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <div className="flex">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <p className="ml-3 text-sm text-green-800">Video uploaded successfully!</p>
              </div>
            </div>
          )}

          {/* Video Metadata Form */}
          {uploadData && uploadStatus === 'idle' && (
            <div className="space-y-6">
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Video Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Video Title
                    </label>
                    <input
                      type="text"
                      value={uploadData.title}
                      onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter video title"
                    />
                  </div>

                  {/* Video Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Video Type
                    </label>
                    <select
                      value={uploadData.type}
                      onChange={(e) => setUploadData({ ...uploadData, type: e.target.value as 'SISW' | 'TAV' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {VIDEO_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type === 'SISW' ? 'SISW (Session in Slow-motion)' : 'TAV (Technical Analysis)'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Session Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session Number
                    </label>
                    <select
                      value={uploadData.sessionNumber}
                      onChange={(e) => setUploadData({ ...uploadData, sessionNumber: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {SESSION_NUMBERS.map((session) => (
                        <option key={session} value={session}>
                          Session {session}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* File Info */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      File Information
                    </label>
                    <div className="text-sm text-gray-600">
                      <p>Name: {uploadData.file.name}</p>
                      <p>Size: {(uploadData.file.size / (1024 * 1024)).toFixed(2)} MB</p>
                      <p>Type: {uploadData.file.type}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={uploadData.description}
                    onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add description, notes, or coaching points..."
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={resetUpload}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={!uploadData.title.trim()}
                    className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Upload Video
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 