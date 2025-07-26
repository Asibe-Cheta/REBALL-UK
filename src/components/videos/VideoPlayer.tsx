'use client';

import { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import { X, Play, Pause, Volume2, VolumeX, Settings, Maximize, RotateCcw, RotateCw } from 'lucide-react';
import { VideoType } from '@/types/video';

interface VideoPlayerProps {
  video: VideoType;
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoPlayer({ video, isOpen, onClose }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [quality, setQuality] = useState<'auto' | '480p' | '720p' | '1080p'>('auto');
  const [showControls, setShowControls] = useState(true);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [lastWatchTime, setLastWatchTime] = useState(0);

  const playerRef = useRef<ReactPlayer>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isOpen) {
      // Resume from last watch time
      if (lastWatchTime > 0) {
        setPlayed(lastWatchTime / duration);
      }
    }
  }, [isOpen, lastWatchTime, duration]);

  useEffect(() => {
    // Track watch time
    const interval = setInterval(() => {
      if (playing && played > 0) {
        const currentTime = played * duration;
        setLastWatchTime(currentTime);

        // Send analytics every 30 seconds
        if (Math.floor(currentTime) % 30 === 0) {
          trackWatchTime(currentTime);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [playing, played, duration]);

  const trackWatchTime = async (watchTime: number) => {
    try {
      await fetch('/api/videos/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoId: video.id,
          watchTime,
          played,
        }),
      });
    } catch (error) {
      console.error('Error tracking watch time:', error);
    }
  };

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    setMuted(newVolume === 0);
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayed(parseFloat(e.target.value));
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
    setSeeking(false);
    if (playerRef.current) {
      playerRef.current.seekTo(parseFloat(e.currentTarget.value));
    }
  };

  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    if (!seeking) {
      setPlayed(state.played);
    }
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  const handleQualityChange = (newQuality: 'auto' | '480p' | '720p' | '1080p') => {
    setQuality(newQuality);
    setShowQualityMenu(false);
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (playing) {
        setShowControls(false);
      }
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <div className="relative w-full h-full max-w-6xl max-h-[90vh] bg-black">
        {/* Video Player */}
        <div
          className="relative w-full h-full"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => {
            if (playing) {
              setShowControls(false);
            }
          }}
        >
          <ReactPlayer
            ref={playerRef}
            url={video.url}
            playing={playing}
            volume={muted ? 0 : volume}
            played={played}
            onProgress={handleProgress}
            onDuration={handleDuration}
            width="100%"
            height="100%"
            style={{ objectFit: 'contain' }}
            config={{
              file: {
                attributes: {
                  controlsList: 'nodownload',
                  onContextMenu: (e: Event) => e.preventDefault(),
                },
              },
            }}
          />

          {/* Custom Controls Overlay */}
          {showControls && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
              {/* Top Controls */}
              <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <h2 className="text-white text-lg font-medium">{video.title}</h2>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${video.type === 'SISW' ? 'bg-blue-600' : 'bg-green-600'
                    } text-white`}>
                    {video.type}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Center Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={handlePlayPause}
                  className="bg-white/20 backdrop-blur-sm rounded-full p-4 hover:bg-white/30 transition-colors"
                >
                  {playing ? (
                    <Pause className="w-8 h-8 text-white" />
                  ) : (
                    <Play className="w-8 h-8 text-white ml-1" />
                  )}
                </button>
              </div>

              {/* Bottom Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                {/* Progress Bar */}
                <div className="mb-4">
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step="any"
                    value={played}
                    onMouseDown={handleSeekMouseDown}
                    onMouseUp={handleSeekMouseUp}
                    onChange={handleSeekChange}
                    className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${played * 100}%, #4b5563 ${played * 100}%, #4b5563 100%)`
                    }}
                  />
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Play/Pause */}
                    <button
                      onClick={handlePlayPause}
                      className="text-white hover:text-gray-300 transition-colors"
                    >
                      {playing ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5" />
                      )}
                    </button>

                    {/* Volume */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setMuted(!muted)}
                        className="text-white hover:text-gray-300 transition-colors"
                      >
                        {muted ? (
                          <VolumeX className="w-5 h-5" />
                        ) : (
                          <Volume2 className="w-5 h-5" />
                        )}
                      </button>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step="any"
                        value={volume}
                        onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                        className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Time Display */}
                    <div className="text-white text-sm">
                      {formatTime(played * duration)} / {formatTime(duration)}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Playback Rate */}
                    <div className="relative">
                      <button
                        onClick={() => setShowQualityMenu(!showQualityMenu)}
                        className="text-white hover:text-gray-300 transition-colors text-sm"
                      >
                        {playbackRate}x
                      </button>
                      {showQualityMenu && (
                        <div className="absolute bottom-full right-0 mb-2 bg-gray-800 rounded-md shadow-lg py-1">
                          {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                            <button
                              key={rate}
                              onClick={() => handlePlaybackRateChange(rate)}
                              className={`block w-full px-4 py-2 text-sm text-left hover:bg-gray-700 ${playbackRate === rate ? 'text-blue-400' : 'text-white'
                                }`}
                            >
                              {rate}x
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Quality Selection */}
                    <div className="relative">
                      <button
                        onClick={() => setShowQualityMenu(!showQualityMenu)}
                        className="text-white hover:text-gray-300 transition-colors"
                      >
                        <Settings className="w-5 h-5" />
                      </button>
                      {showQualityMenu && (
                        <div className="absolute bottom-full right-0 mb-2 bg-gray-800 rounded-md shadow-lg py-1">
                          {['auto', '480p', '720p', '1080p'].map((q) => (
                            <button
                              key={q}
                              onClick={() => handleQualityChange(q as any)}
                              className={`block w-full px-4 py-2 text-sm text-left hover:bg-gray-700 ${quality === q ? 'text-blue-400' : 'text-white'
                                }`}
                            >
                              {q === 'auto' ? 'Auto' : q}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Fullscreen */}
                    <button
                      onClick={() => {
                        if (document.fullscreenElement) {
                          document.exitFullscreen();
                        } else {
                          document.documentElement.requestFullscreen();
                        }
                      }}
                      className="text-white hover:text-gray-300 transition-colors"
                    >
                      <Maximize className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Video Info Panel */}
        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-4 max-w-sm">
          <h3 className="text-white font-medium mb-2">{video.title}</h3>
          {video.description && (
            <p className="text-gray-300 text-sm mb-2">{video.description}</p>
          )}
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <span>Session {video.sessionNumber}</span>
            <span>•</span>
            <span>{video.type}</span>
            {video.watchTime && (
              <>
                <span>•</span>
                <span>{Math.round(video.watchTime / 60)} min watched</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 