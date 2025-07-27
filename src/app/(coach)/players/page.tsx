'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Users,
  User,
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
  Star,
  TrendingUp,
  FileText,
  Camera,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  Share,
  Download as DownloadIcon,
  Calendar as CalendarIcon,
  MessageCircle,
  Play,
  BookOpen,
  GraduationCap,
  Shield,
  Heart,
  Activity,
  Zap
} from 'lucide-react';

interface Player {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  position: string;
  playingLevel: 'grassroots' | 'semi-professional' | 'professional';
  currentTeam: string;
  course: string;
  progress: number;
  sessionsCompleted: number;
  totalSessions: number;
  nextSession: string;
  confidenceImprovement: number;
  attendanceRate: number;
  lastSession: string;
  registrationDate: string;
  medicalConditions?: string;
  parentContact?: {
    name: string;
    phone: string;
    email: string;
  };
  image: string;
}

interface Session {
  id: string;
  playerId: string;
  sessionNumber: number;
  date: string;
  status: 'completed' | 'scheduled' | 'cancelled';
  attendance: 'present' | 'absent' | 'pending';
  confidenceBefore: number;
  confidenceAfter: number;
  notes: string;
}

interface Video {
  id: string;
  playerId: string;
  title: string;
  type: 'SISW' | 'TAV' | 'Training Highlight';
  uploadDate: string;
  viewCount: number;
  duration: number;
}

export default function PlayerManagement() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<'overview' | 'profiles' | 'progress' | 'sessions' | 'communication' | 'videos' | 'assessments' | 'admin' | 'reports'>('overview');
  const [players, setPlayers] = useState<Player[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPosition, setFilterPosition] = useState('all');
  const [filterCourse, setFilterCourse] = useState('all');
  const [filterProgress, setFilterProgress] = useState('all');
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'progress' | 'lastSession' | 'registrationDate'>('name');

  // Mock data for demonstration
  useEffect(() => {
    const mockPlayers: Player[] = [
      {
        id: '1',
        name: 'Alex Thompson',
        email: 'alex@example.com',
        phone: '+44 123 456 7890',
        age: 14,
        position: 'Striker',
        playingLevel: 'grassroots',
        currentTeam: 'Devon United U14',
        course: '1v1 Attacking Finishing',
        progress: 75,
        sessionsCompleted: 6,
        totalSessions: 8,
        nextSession: '2024-01-15 14:00',
        confidenceImprovement: 25,
        attendanceRate: 92,
        lastSession: '2024-01-08',
        registrationDate: '2023-09-15',
        parentContact: {
          name: 'Sarah Thompson',
          phone: '+44 123 456 7891',
          email: 'sarah@example.com'
        },
        image: '/images/players/alex.jpg'
      },
      {
        id: '2',
        name: 'Emma Rodriguez',
        email: 'emma@example.com',
        phone: '+44 123 456 7892',
        age: 16,
        position: 'Winger',
        playingLevel: 'semi-professional',
        currentTeam: 'Exeter City U16',
        course: '1v1 Attacking Crossing',
        progress: 60,
        sessionsCompleted: 5,
        totalSessions: 8,
        nextSession: '2024-01-16 15:30',
        confidenceImprovement: 18,
        attendanceRate: 88,
        lastSession: '2024-01-09',
        registrationDate: '2023-10-20',
        parentContact: {
          name: 'Carlos Rodriguez',
          phone: '+44 123 456 7893',
          email: 'carlos@example.com'
        },
        image: '/images/players/emma.jpg'
      },
      {
        id: '3',
        name: 'David Chen',
        email: 'david@example.com',
        phone: '+44 123 456 7894',
        age: 15,
        position: 'CAM',
        playingLevel: 'grassroots',
        currentTeam: 'Plymouth Youth FC',
        course: '1v1 Attacking Finishing',
        progress: 90,
        sessionsCompleted: 7,
        totalSessions: 8,
        nextSession: '2024-01-17 16:00',
        confidenceImprovement: 32,
        attendanceRate: 95,
        lastSession: '2024-01-10',
        registrationDate: '2023-08-05',
        parentContact: {
          name: 'Li Chen',
          phone: '+44 123 456 7895',
          email: 'li@example.com'
        },
        image: '/images/players/david.jpg'
      }
    ];

    const mockSessions: Session[] = [
      {
        id: '1',
        playerId: '1',
        sessionNumber: 6,
        date: '2024-01-08',
        status: 'completed',
        attendance: 'present',
        confidenceBefore: 6,
        confidenceAfter: 8,
        notes: 'Excellent improvement in finishing technique. Need to work on composure under pressure.'
      },
      {
        id: '2',
        playerId: '2',
        sessionNumber: 5,
        date: '2024-01-09',
        status: 'completed',
        attendance: 'present',
        confidenceBefore: 5,
        confidenceAfter: 7,
        notes: 'Good progress with crossing accuracy. Continue practicing delivery from different angles.'
      }
    ];

    const mockVideos: Video[] = [
      {
        id: '1',
        playerId: '1',
        title: 'Session 6 - Finishing Analysis',
        type: 'SISW',
        uploadDate: '2024-01-08',
        viewCount: 3,
        duration: 180
      },
      {
        id: '2',
        playerId: '2',
        title: 'Crossing Technique Analysis',
        type: 'TAV',
        uploadDate: '2024-01-09',
        viewCount: 2,
        duration: 240
      }
    ];

    setPlayers(mockPlayers);
    setSessions(mockSessions);
    setVideos(mockVideos);
    setLoading(false);
  }, []);

  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPosition = filterPosition === 'all' || player.position === filterPosition;
    const matchesCourse = filterCourse === 'all' || player.course === filterCourse;
    const matchesProgress = filterProgress === 'all' ||
      (filterProgress === 'low' && player.progress < 50) ||
      (filterProgress === 'medium' && player.progress >= 50 && player.progress < 80) ||
      (filterProgress === 'high' && player.progress >= 80);

    return matchesSearch && matchesPosition && matchesCourse && matchesProgress;
  });

  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'progress':
        return b.progress - a.progress;
      case 'lastSession':
        return new Date(b.lastSession).getTime() - new Date(a.lastSession).getTime();
      case 'registrationDate':
        return new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime();
      default:
        return 0;
    }
  });

  const playerStats = {
    totalPlayers: players.length,
    activeCourses: players.filter(p => p.progress > 0).length,
    averageProgress: Math.round(players.reduce((sum, p) => sum + p.progress, 0) / players.length),
    averageAttendance: Math.round(players.reduce((sum, p) => sum + p.attendanceRate, 0) / players.length)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading player management...</p>
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
              <Users className="w-8 h-8 text-blue-500" />
              <h1 className="text-2xl font-bold text-gray-900">Player Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add Player</span>
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
              { id: 'profiles', label: 'Player Profiles', icon: User },
              { id: 'progress', label: 'Progress', icon: TrendingUp },
              { id: 'sessions', label: 'Sessions', icon: Calendar },
              { id: 'communication', label: 'Communication', icon: MessageSquare },
              { id: 'videos', label: 'Videos', icon: Video },
              { id: 'assessments', label: 'Assessments', icon: Award },
              { id: 'admin', label: 'Admin', icon: Settings },
              { id: 'reports', label: 'Reports', icon: FileText }
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
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-blue-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-600">Total Players</p>
                    <p className="text-2xl font-bold text-blue-900">{playerStats.totalPlayers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <BookOpen className="w-8 h-8 text-green-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-600">Active Courses</p>
                    <p className="text-2xl font-bold text-green-900">{playerStats.activeCourses}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <TrendingUp className="w-8 h-8 text-purple-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-purple-600">Avg Progress</p>
                    <p className="text-2xl font-bold text-purple-900">{playerStats.averageProgress}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <CheckCircle className="w-8 h-8 text-orange-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-orange-600">Avg Attendance</p>
                    <p className="text-2xl font-bold text-orange-900">{playerStats.averageAttendance}%</p>
                  </div>
                </div>
              </div>
            </div>

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
                  <select
                    value={filterProgress}
                    onChange={(e) => setFilterProgress(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Progress</option>
                    <option value="low">Low (0-49%)</option>
                    <option value="medium">Medium (50-79%)</option>
                    <option value="high">High (80-100%)</option>
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="progress">Sort by Progress</option>
                    <option value="lastSession">Sort by Last Session</option>
                    <option value="registrationDate">Sort by Registration</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Player Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedPlayers.map((player) => (
                <div key={player.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{player.name}</h3>
                      <p className="text-sm text-gray-600">{player.position} • {player.age} years</p>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
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
                      <p className="text-sm text-gray-600">Sessions</p>
                      <p className="text-sm font-medium text-gray-900">
                        {player.sessionsCompleted}/{player.totalSessions}
                      </p>
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
                    <button
                      onClick={() => setSelectedPlayer(player.id)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                    >
                      View Profile
                    </button>
                    <button className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm font-medium transition-colors">
                      Message
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Player Profiles Tab */}
        {activeTab === 'profiles' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Player Profiles</h2>
              <div className="space-y-6">
                {players.map((player) => (
                  <div key={player.id} className="border rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-8 h-8 text-gray-500" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{player.name}</h3>
                          <p className="text-gray-600">{player.position} • {player.age} years old</p>
                          <p className="text-sm text-gray-500">{player.currentTeam}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${player.playingLevel === 'professional' ? 'bg-purple-100 text-purple-800' :
                            player.playingLevel === 'semi-professional' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'
                          }`}>
                          {player.playingLevel}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{player.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{player.phone}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Parent/Guardian</h4>
                        {player.parentContact && (
                          <div className="space-y-2">
                            <p className="text-sm text-gray-600">{player.parentContact.name}</p>
                            <div className="flex items-center space-x-2">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{player.parentContact.phone}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{player.parentContact.email}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {player.medicalConditions && (
                      <div className="mt-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Medical Information</h4>
                        <p className="text-sm text-gray-600">{player.medicalConditions}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Training Progress</h2>
              <div className="space-y-6">
                {players.map((player) => (
                  <div key={player.id} className="border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{player.name}</h3>
                      <span className="text-sm text-gray-500">{player.course}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Course Progress</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span className="font-medium">{player.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${player.progress}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>Sessions: {player.sessionsCompleted}/{player.totalSessions}</span>
                            <span>Next: {player.nextSession}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Confidence Improvement</h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="w-5 h-5 text-green-500" />
                            <span className="text-lg font-bold text-green-600">+{player.confidenceImprovement}%</span>
                          </div>
                          <p className="text-sm text-gray-600">Overall confidence improvement</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Attendance</h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span className="text-lg font-bold text-green-600">{player.attendanceRate}%</span>
                          </div>
                          <p className="text-sm text-gray-600">Session attendance rate</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sessions Tab */}
        {activeTab === 'sessions' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Session Management</h2>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Schedule Session
                </button>
              </div>

              <div className="space-y-4">
                {sessions.map((session) => {
                  const player = players.find(p => p.id === session.playerId);
                  return (
                    <div key={session.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{player?.name}</h4>
                          <p className="text-sm text-gray-600">
                            Session {session.sessionNumber} • {session.date}
                          </p>
                          <p className="text-sm text-gray-500">{session.notes}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${session.attendance === 'present' ? 'bg-green-100 text-green-800' :
                              session.attendance === 'absent' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                            }`}>
                            {session.attendance}
                          </span>
                          <div className="text-right">
                            <div className="text-sm text-gray-600">Confidence</div>
                            <div className="text-sm font-medium">
                              {session.confidenceBefore} → {session.confidenceAfter}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Communication Tab */}
        {activeTab === 'communication' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Communication Hub</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Send Message to Player</h3>
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
                  <h3 className="font-semibold text-gray-900 mb-3">Broadcast Announcement</h3>
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

        {/* Videos Tab */}
        {activeTab === 'videos' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Video Management</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => {
                  const player = players.find(p => p.id === video.playerId);
                  return (
                    <div key={video.id} className="border rounded-lg overflow-hidden">
                      <div className="aspect-video bg-gray-200 flex items-center justify-center">
                        <Play className="w-12 h-12 text-gray-400" />
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">{video.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {player?.name} • {video.type}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{video.uploadDate}</span>
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
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Assessments Tab */}
        {activeTab === 'assessments' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Assessment & Feedback</h2>
              <div className="space-y-4">
                {players.map((player) => (
                  <div key={player.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{player.name}</h4>
                        <p className="text-sm text-gray-600">{player.course}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors">
                          Add Feedback
                        </button>
                        <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors">
                          Assessment
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Admin Tab */}
        {activeTab === 'admin' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Administrative Functions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Course Assignments</h3>
                  <div className="space-y-3">
                    {players.map((player) => (
                      <div key={player.id} className="flex items-center justify-between">
                        <span className="text-sm">{player.name}</span>
                        <select className="px-2 py-1 border border-gray-300 rounded text-sm">
                          <option>{player.course}</option>
                          <option>1v1 Attacking Finishing</option>
                          <option>1v1 Attacking Crossing</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Certificate Approvals</h3>
                  <div className="space-y-3">
                    {players.filter(p => p.progress >= 90).map((player) => (
                      <div key={player.id} className="flex items-center justify-between">
                        <span className="text-sm">{player.name}</span>
                        <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors">
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

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Reports & Analytics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Generate Reports</h3>
                  <div className="space-y-3">
                    <button className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                      Progress Reports
                    </button>
                    <button className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                      Performance Analytics
                    </button>
                    <button className="w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                      Session Summaries
                    </button>
                    <button className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                      Parent Reports
                    </button>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Export Data</h3>
                  <div className="space-y-3">
                    <button className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                      Export Player Data
                    </button>
                    <button className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                      Export Session Data
                    </button>
                    <button className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                      Export Analytics
                    </button>
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