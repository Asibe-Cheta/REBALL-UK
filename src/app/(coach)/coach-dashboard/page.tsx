'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Users,
  Calendar,
  MessageSquare,
  Video,
  BarChart3,
  Target,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Send,
  Bell,
  Settings,
  User,
  Star,
  TrendingUp,
  FileText,
  Camera,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  ChevronDown,
  MoreHorizontal
} from 'lucide-react';

interface Player {
  id: string;
  name: string;
  email: string;
  position: string;
  course: string;
  progress: number;
  nextSession: string;
  confidenceImprovement: number;
  image: string;
  phone: string;
}

interface Session {
  id: string;
  playerName: string;
  playerId: string;
  type: '1v1' | 'group';
  course: string;
  sessionNumber: number;
  date: string;
  time: string;
  location: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

interface Feedback {
  id: string;
  playerName: string;
  sessionNumber: number;
  date: string;
  confidenceBefore: number;
  confidenceAfter: number;
  feedback: string;
  status: 'pending' | 'submitted';
}

interface Video {
  id: string;
  playerName: string;
  sessionNumber: number;
  type: 'SISW' | 'TAV';
  title: string;
  status: 'uploading' | 'processing' | 'completed';
  uploadDate: string;
  duration?: number;
}

export default function CoachDashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<'overview' | 'players' | 'sessions' | 'feedback' | 'videos' | 'analytics' | 'communication' | 'planning' | 'performance' | 'admin'>('overview');
  const [players, setPlayers] = useState<Player[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPosition, setFilterPosition] = useState('all');
  const [filterCourse, setFilterCourse] = useState('all');

  // Mock data for demonstration
  useEffect(() => {
    const mockPlayers: Player[] = [
      {
        id: '1',
        name: 'Alex Thompson',
        email: 'alex@example.com',
        position: 'Striker',
        course: '1v1 Attacking Finishing',
        progress: 75,
        nextSession: '2024-01-15 14:00',
        confidenceImprovement: 25,
        image: '/images/players/alex.jpg',
        phone: '+44 123 456 7890'
      },
      {
        id: '2',
        name: 'Emma Rodriguez',
        email: 'emma@example.com',
        position: 'Winger',
        course: '1v1 Attacking Crossing',
        progress: 60,
        nextSession: '2024-01-16 15:30',
        confidenceImprovement: 18,
        image: '/images/players/emma.jpg',
        phone: '+44 123 456 7891'
      },
      {
        id: '3',
        name: 'David Chen',
        email: 'david@example.com',
        position: 'CAM',
        course: '1v1 Attacking Finishing',
        progress: 90,
        nextSession: '2024-01-17 16:00',
        confidenceImprovement: 32,
        image: '/images/players/david.jpg',
        phone: '+44 123 456 7892'
      }
    ];

    const mockSessions: Session[] = [
      {
        id: '1',
        playerName: 'Alex Thompson',
        playerId: '1',
        type: '1v1',
        course: '1v1 Attacking Finishing',
        sessionNumber: 5,
        date: '2024-01-15',
        time: '14:00',
        location: 'REBALL Training Ground',
        status: 'scheduled',
        notes: 'Focus on finishing under pressure'
      },
      {
        id: '2',
        playerName: 'Emma Rodriguez',
        playerId: '2',
        type: '1v1',
        course: '1v1 Attacking Crossing',
        sessionNumber: 4,
        date: '2024-01-16',
        time: '15:30',
        location: 'REBALL Training Ground',
        status: 'scheduled'
      }
    ];

    const mockFeedback: Feedback[] = [
      {
        id: '1',
        playerName: 'Alex Thompson',
        sessionNumber: 4,
        date: '2024-01-10',
        confidenceBefore: 6,
        confidenceAfter: 8,
        feedback: 'Excellent improvement in finishing technique. Need to work on composure under pressure.',
        status: 'submitted'
      },
      {
        id: '2',
        playerName: 'Emma Rodriguez',
        sessionNumber: 3,
        date: '2024-01-09',
        confidenceBefore: 5,
        confidenceAfter: 7,
        feedback: 'Good progress with crossing accuracy. Continue practicing delivery from different angles.',
        status: 'submitted'
      }
    ];

    const mockVideos: Video[] = [
      {
        id: '1',
        playerName: 'Alex Thompson',
        sessionNumber: 4,
        type: 'SISW',
        title: 'Session 4 - Finishing Analysis',
        status: 'completed',
        uploadDate: '2024-01-10',
        duration: 180
      },
      {
        id: '2',
        playerName: 'Emma Rodriguez',
        sessionNumber: 3,
        type: 'TAV',
        title: 'Crossing Technique Analysis',
        status: 'processing',
        uploadDate: '2024-01-09'
      }
    ];

    setPlayers(mockPlayers);
    setSessions(mockSessions);
    setFeedback(mockFeedback);
    setVideos(mockVideos);
    setLoading(false);
  }, []);

  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPosition = filterPosition === 'all' || player.position === filterPosition;
    const matchesCourse = filterCourse === 'all' || player.course === filterCourse;

    return matchesSearch && matchesPosition && matchesCourse;
  });

  const todaySessions = sessions.filter(session =>
    session.date === new Date().toISOString().split('T')[0]
  );

  const pendingFeedback = feedback.filter(f => f.status === 'pending');
  const pendingVideos = videos.filter(v => v.status === 'uploading' || v.status === 'processing');

  const coachStats = {
    totalPlayers: players.length,
    sessionsThisWeek: sessions.filter(s => s.status === 'completed').length,
    pendingFeedback: pendingFeedback.length,
    pendingVideos: pendingVideos.length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading coach dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Coach Dashboard</h1>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>Welcome back, Coach {session?.user?.name || 'Coach'}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'players', label: 'Players', icon: Users },
              { id: 'sessions', label: 'Sessions', icon: Calendar },
              { id: 'feedback', label: 'Feedback', icon: MessageSquare },
              { id: 'videos', label: 'Videos', icon: Video },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'communication', label: 'Communication', icon: Send },
              { id: 'planning', label: 'Planning', icon: Target },
              { id: 'performance', label: 'Performance', icon: Award },
              { id: 'admin', label: 'Admin', icon: Settings }
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
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome back, Coach {session?.user?.name || 'Coach'}!
              </h2>
              <p className="text-gray-600 mb-6">
                Here's your daily summary and quick access to your most important tasks.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Users className="w-8 h-8 text-blue-500" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-blue-600">Total Players</p>
                      <p className="text-2xl font-bold text-blue-900">{coachStats.totalPlayers}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Calendar className="w-8 h-8 text-green-500" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-600">Sessions This Week</p>
                      <p className="text-2xl font-bold text-green-900">{coachStats.sessionsThisWeek}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <MessageSquare className="w-8 h-8 text-orange-500" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-orange-600">Pending Feedback</p>
                      <p className="text-2xl font-bold text-orange-900">{coachStats.pendingFeedback}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Video className="w-8 h-8 text-purple-500" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-purple-600">Pending Videos</p>
                      <p className="text-2xl font-bold text-purple-900">{coachStats.pendingVideos}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Today's Sessions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Sessions</h3>
              {todaySessions.length > 0 ? (
                <div className="space-y-4">
                  {todaySessions.map((session) => (
                    <div key={session.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">{session.playerName}</h4>
                          <p className="text-sm text-gray-600">
                            {session.course} - Session {session.sessionNumber} • {session.time}
                          </p>
                          <p className="text-sm text-gray-500">{session.location}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${session.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                            session.status === 'completed' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                            {session.status}
                          </span>
                          <button className="p-2 text-gray-400 hover:text-gray-600">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No sessions scheduled for today.</p>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {feedback.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Feedback submitted for {item.playerName}
                      </p>
                      <p className="text-xs text-gray-500">
                        Session {item.sessionNumber} • {item.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Players Tab */}
        {activeTab === 'players' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search players..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex space-x-4">
                  <select
                    value={filterPosition}
                    onChange={(e) => setFilterPosition(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Positions</option>
                    <option value="Striker">Striker</option>
                    <option value="Winger">Winger</option>
                    <option value="CAM">CAM</option>
                    <option value="Full-back">Full-back</option>
                  </select>
                  <select
                    value={filterCourse}
                    onChange={(e) => setFilterCourse(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Courses</option>
                    <option value="1v1 Attacking Finishing">1v1 Attacking Finishing</option>
                    <option value="1v1 Attacking Crossing">1v1 Attacking Crossing</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Players Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlayers.map((player) => (
                <div key={player.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{player.name}</h3>
                      <p className="text-sm text-gray-600">{player.position}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Course Progress</p>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${player.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{player.progress}%</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Course</p>
                      <p className="text-sm font-medium text-gray-900">{player.course}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Next Session</p>
                      <p className="text-sm font-medium text-gray-900">{player.nextSession}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Confidence Improvement</p>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium text-green-600">+{player.confidenceImprovement}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-4">
                    <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium transition-colors">
                      View Profile
                    </button>
                    <button className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm font-medium transition-colors">
                      Add Feedback
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sessions Tab */}
        {activeTab === 'sessions' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Management</h3>
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{session.playerName}</h4>
                        <p className="text-sm text-gray-600">
                          {session.course} - Session {session.sessionNumber} • {session.type}
                        </p>
                        <p className="text-sm text-gray-500">
                          {session.date} at {session.time} • {session.location}
                        </p>
                        {session.notes && (
                          <p className="text-sm text-gray-500 mt-1">Notes: {session.notes}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${session.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          session.status === 'completed' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                          {session.status}
                        </span>
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Feedback Tab */}
        {activeTab === 'feedback' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Feedback Management</h3>
              <div className="space-y-4">
                {feedback.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{item.playerName}</h4>
                        <p className="text-sm text-gray-600">
                          Session {item.sessionNumber} • {item.date}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Before:</span>
                            <span className="text-sm font-medium text-gray-900">{item.confidenceBefore}/10</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">After:</span>
                            <span className="text-sm font-medium text-gray-900">{item.confidenceAfter}/10</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-medium text-green-600">
                              +{item.confidenceAfter - item.confidenceBefore}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">{item.feedback}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'submitted' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                          }`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Videos Tab */}
        {activeTab === 'videos' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Video Management</h3>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
                  <Upload className="w-4 h-4" />
                  <span>Upload Video</span>
                </button>
              </div>

              <div className="space-y-4">
                {videos.map((video) => (
                  <div key={video.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{video.title}</h4>
                        <p className="text-sm text-gray-600">
                          {video.playerName} • Session {video.sessionNumber} • {video.type}
                        </p>
                        <p className="text-sm text-gray-500">
                          Uploaded: {video.uploadDate}
                          {video.duration && ` • Duration: ${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}`}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${video.status === 'completed' ? 'bg-green-100 text-green-800' :
                          video.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                          {video.status}
                        </span>
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
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
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Player Progress Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Average Confidence Improvement</h4>
                  <p className="text-3xl font-bold text-blue-900">+25%</p>
                  <p className="text-sm text-blue-600">Across all players</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">Course Completion Rate</h4>
                  <p className="text-3xl font-bold text-green-900">85%</p>
                  <p className="text-sm text-green-600">Players completing full courses</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-2">Session Attendance</h4>
                  <p className="text-3xl font-bold text-purple-900">92%</p>
                  <p className="text-sm text-purple-600">Average attendance rate</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Communication Tab */}
        {activeTab === 'communication' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Communication Tools</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Send Message to Player</h4>
                  <div className="space-y-3">
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option>Select Player</option>
                      {players.map(player => (
                        <option key={player.id}>{player.name}</option>
                      ))}
                    </select>
                    <textarea
                      placeholder="Type your message..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      rows={4}
                    ></textarea>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                      Send Message
                    </button>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Broadcast Announcement</h4>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Announcement title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <textarea
                      placeholder="Type your announcement..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      rows={4}
                    ></textarea>
                    <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                      Send to All Players
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Planning Tab */}
        {activeTab === 'planning' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Course & Session Planning</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Session Templates</h4>
                  <div className="space-y-2">
                    <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50">
                      <h5 className="font-medium">1v1 Finishing Session</h5>
                      <p className="text-sm text-gray-600">Focus on finishing under pressure</p>
                    </button>
                    <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50">
                      <h5 className="font-medium">Crossing Technique Session</h5>
                      <p className="text-sm text-gray-600">Improve delivery accuracy</p>
                    </button>
                    <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50">
                      <h5 className="font-medium">Defensive 1v1 Session</h5>
                      <p className="text-sm text-gray-600">Defensive positioning and tackling</p>
                    </button>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Resource Library</h4>
                  <div className="space-y-2">
                    <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50">
                      <h5 className="font-medium">REBALL Training Methodology</h5>
                      <p className="text-sm text-gray-600">Core training principles</p>
                    </button>
                    <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50">
                      <h5 className="font-medium">Drill Database</h5>
                      <p className="text-sm text-gray-600">1v1 training exercises</p>
                    </button>
                    <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50">
                      <h5 className="font-medium">Coaching Resources</h5>
                      <p className="text-sm text-gray-600">Professional development materials</p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Coach Performance Tracking</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Average Player Improvement</h4>
                  <p className="text-3xl font-bold text-blue-900">+28%</p>
                  <p className="text-sm text-blue-600">Confidence improvement</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">Player Satisfaction</h4>
                  <p className="text-3xl font-bold text-green-900">4.8/5</p>
                  <p className="text-sm text-green-600">Average rating</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-2">Session Completion</h4>
                  <p className="text-3xl font-bold text-purple-900">96%</p>
                  <p className="text-sm text-purple-600">On-time completion</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-900 mb-2">Course Completion</h4>
                  <p className="text-3xl font-bold text-orange-900">88%</p>
                  <p className="text-sm text-orange-600">Players completing courses</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Admin Tab */}
        {activeTab === 'admin' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Administrative Tasks</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Attendance Tracking</h4>
                  <div className="space-y-3">
                    {sessions.slice(0, 3).map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{session.playerName}</p>
                          <p className="text-sm text-gray-600">{session.date} at {session.time}</p>
                        </div>
                        <button className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">
                          Mark Present
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Certificate Approvals</h4>
                  <div className="space-y-3">
                    {players.filter(p => p.progress >= 90).map((player) => (
                      <div key={player.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{player.name}</p>
                          <p className="text-sm text-gray-600">{player.course} - {player.progress}% complete</p>
                        </div>
                        <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                          Approve Certificate
                        </button>
                      </div>
                    ))}
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