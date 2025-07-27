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
  Zap,
  DollarSign,
  CreditCard,
  PieChart,
  LineChart,
  ArrowUp,
  ArrowDown,
  Database,
  Server,
  Lock,
  AlertTriangle,
  RefreshCw,
  BarChart,
  Users2,
  VideoIcon,
  BookOpenIcon,
  DollarSignIcon,
  SettingsIcon,
  BellIcon,
  TrendingUpIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  XCircle,
  ClockIcon,
  CalendarIcon as CalendarIcon2,
  FileTextIcon,
  ShieldIcon,
  DatabaseIcon,
  ServerIcon,
  LockIcon,
  AlertTriangleIcon,
  RefreshCwIcon,
  BarChartIcon
} from 'lucide-react';

interface PlatformMetrics {
  totalUsers: number;
  activeUsers: number;
  newRegistrations: number;
  totalRevenue: number;
  monthlyRevenue: number;
  activeCourses: number;
  completionRate: number;
  totalSessions: number;
  attendanceRate: number;
  totalVideos: number;
  storageUsed: number;
  storageLimit: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'player' | 'coach' | 'admin';
  status: 'active' | 'suspended' | 'pending';
  registrationDate: string;
  lastLogin: string;
  profileComplete: boolean;
}

interface Coach {
  id: string;
  name: string;
  email: string;
  assignedPlayers: number;
  satisfactionRating: number;
  sessionCompletionRate: number;
  videoUploadCount: number;
  playerImprovementAvg: number;
  status: 'active' | 'inactive';
}

interface Course {
  id: string;
  name: string;
  position: string;
  enrollmentCount: number;
  completionRate: number;
  satisfactionRating: number;
  price: number;
  status: 'active' | 'inactive';
}

interface FinancialData {
  totalRevenue: number;
  monthlyRevenue: number;
  weeklyRevenue: number;
  paymentMethods: {
    stripe: number;
    card: number;
    bank: number;
  };
  refunds: number;
  chargebacks: number;
  outstandingPayments: number;
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'coaches' | 'courses' | 'financial' | 'sessions' | 'videos' | 'system' | 'communication' | 'analytics'>('overview');
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data for demonstration
  useEffect(() => {
    const mockMetrics: PlatformMetrics = {
      totalUsers: 1247,
      activeUsers: 892,
      newRegistrations: 45,
      totalRevenue: 125000,
      monthlyRevenue: 18500,
      activeCourses: 8,
      completionRate: 78,
      totalSessions: 3420,
      attendanceRate: 92,
      totalVideos: 1560,
      storageUsed: 85,
      storageLimit: 100
    };

    const mockUsers: User[] = [
      {
        id: '1',
        name: 'Alex Thompson',
        email: 'alex@example.com',
        role: 'player',
        status: 'active',
        registrationDate: '2023-09-15',
        lastLogin: '2024-01-10',
        profileComplete: true
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah@reball.uk',
        role: 'coach',
        status: 'active',
        registrationDate: '2023-08-01',
        lastLogin: '2024-01-10',
        profileComplete: true
      },
      {
        id: '3',
        name: 'Mike Davis',
        email: 'mike@example.com',
        role: 'player',
        status: 'pending',
        registrationDate: '2024-01-08',
        lastLogin: '2024-01-08',
        profileComplete: false
      }
    ];

    const mockCoaches: Coach[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah@reball.uk',
        assignedPlayers: 12,
        satisfactionRating: 4.8,
        sessionCompletionRate: 95,
        videoUploadCount: 45,
        playerImprovementAvg: 28,
        status: 'active'
      },
      {
        id: '2',
        name: 'David Wilson',
        email: 'david@reball.uk',
        assignedPlayers: 8,
        satisfactionRating: 4.6,
        sessionCompletionRate: 88,
        videoUploadCount: 32,
        playerImprovementAvg: 24,
        status: 'active'
      }
    ];

    const mockCourses: Course[] = [
      {
        id: '1',
        name: '1v1 Attacking Finishing',
        position: 'Striker',
        enrollmentCount: 156,
        completionRate: 82,
        satisfactionRating: 4.7,
        price: 400,
        status: 'active'
      },
      {
        id: '2',
        name: '1v1 Attacking Crossing',
        position: 'Winger',
        enrollmentCount: 134,
        completionRate: 75,
        satisfactionRating: 4.5,
        price: 400,
        status: 'active'
      }
    ];

    const mockFinancialData: FinancialData = {
      totalRevenue: 125000,
      monthlyRevenue: 18500,
      weeklyRevenue: 4200,
      paymentMethods: {
        stripe: 85,
        card: 12,
        bank: 3
      },
      refunds: 1200,
      chargebacks: 300,
      outstandingPayments: 4500
    };

    setMetrics(mockMetrics);
    setUsers(mockUsers);
    setCoaches(mockCoaches);
    setCourses(mockCourses);
    setFinancialData(mockFinancialData);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
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
              <Shield className="w-8 h-8 text-red-500" />
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                System Settings
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
              { id: 'users', label: 'Users', icon: Users },
              { id: 'coaches', label: 'Coaches', icon: User },
              { id: 'courses', label: 'Courses', icon: BookOpen },
              { id: 'financial', label: 'Financial', icon: DollarSign },
              { id: 'sessions', label: 'Sessions', icon: Calendar },
              { id: 'videos', label: 'Videos', icon: Video },
              { id: 'system', label: 'System', icon: Settings },
              { id: 'communication', label: 'Communication', icon: MessageSquare },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === tab.id
                    ? 'border-red-500 text-red-600'
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
        {activeTab === 'overview' && metrics && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-blue-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-600">Total Users</p>
                    <p className="text-2xl font-bold text-blue-900">{metrics.totalUsers.toLocaleString()}</p>
                    <p className="text-xs text-green-600">+{metrics.newRegistrations} this month</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <DollarSign className="w-8 h-8 text-green-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-900">£{metrics.totalRevenue.toLocaleString()}</p>
                    <p className="text-xs text-green-600">+£{metrics.monthlyRevenue.toLocaleString()} this month</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <BookOpen className="w-8 h-8 text-purple-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-purple-600">Active Courses</p>
                    <p className="text-2xl font-bold text-purple-900">{metrics.activeCourses}</p>
                    <p className="text-xs text-purple-600">{metrics.completionRate}% completion rate</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <Video className="w-8 h-8 text-orange-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-orange-600">Total Videos</p>
                    <p className="text-2xl font-bold text-orange-900">{metrics.totalVideos}</p>
                    <p className="text-xs text-orange-600">{metrics.storageUsed}% storage used</p>
                  </div>
                </div>
              </div>
            </div>

            {/* System Health */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Database Status</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">Healthy</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Storage Usage</span>
                    <span className="text-sm text-gray-900">{metrics.storageUsed}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">API Performance</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">Optimal</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Analytics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Sessions</span>
                    <span className="text-sm font-medium text-gray-900">{metrics.totalSessions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Attendance Rate</span>
                    <span className="text-sm font-medium text-gray-900">{metrics.attendanceRate}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Active Users</span>
                    <span className="text-sm font-medium text-gray-900">{metrics.activeUsers}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium transition-colors">
                    Add New User
                  </button>
                  <button className="w-full bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm font-medium transition-colors">
                    Create Course
                  </button>
                  <button className="w-full bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded text-sm font-medium transition-colors">
                    System Backup
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">User Management</h2>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Add User
                </button>
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-6">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex space-x-4">
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Roles</option>
                    <option value="player">Players</option>
                    <option value="coach">Coaches</option>
                    <option value="admin">Admins</option>
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{user.name}</h4>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-xs text-gray-500">Registered: {user.registrationDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-red-100 text-red-800' :
                            user.role === 'coach' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'
                          }`}>
                          {user.role}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.status === 'active' ? 'bg-green-100 text-green-800' :
                            user.status === 'suspended' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                          }`}>
                          {user.status}
                        </span>
                        <div className="flex items-center space-x-2">
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <MoreHorizontal className="w-4 h-4" />
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

        {/* Coaches Tab */}
        {activeTab === 'coaches' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Coach Management</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coaches.map((coach) => (
                  <div key={coach.id} className="border rounded-lg p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{coach.name}</h3>
                        <p className="text-sm text-gray-600">{coach.email}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${coach.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {coach.status}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Assigned Players</span>
                        <span className="text-sm font-medium text-gray-900">{coach.assignedPlayers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Satisfaction Rating</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium text-gray-900">{coach.satisfactionRating}</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Session Completion</span>
                        <span className="text-sm font-medium text-gray-900">{coach.sessionCompletionRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Videos Uploaded</span>
                        <span className="text-sm font-medium text-gray-900">{coach.videoUploadCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Avg Improvement</span>
                        <span className="text-sm font-medium text-gray-900">+{coach.playerImprovementAvg}%</span>
                      </div>
                    </div>

                    <div className="flex space-x-2 mt-4">
                      <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium transition-colors">
                        View Profile
                      </button>
                      <button className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm font-medium transition-colors">
                        Assign Players
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Course Management</h2>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Create Course
                </button>
              </div>

              <div className="space-y-4">
                {courses.map((course) => (
                  <div key={course.id} className="border rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
                        <p className="text-sm text-gray-600">{course.position} • £{course.price}</p>
                        <div className="flex items-center space-x-6 mt-2">
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{course.enrollmentCount} enrolled</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{course.completionRate}% completion</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm text-gray-600">{course.satisfactionRating} rating</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${course.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                          {course.status}
                        </span>
                        <div className="flex items-center space-x-2">
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <MoreHorizontal className="w-4 h-4" />
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

        {/* Financial Tab */}
        {activeTab === 'financial' && financialData && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <DollarSign className="w-8 h-8 text-green-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-900">£{financialData.totalRevenue.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <TrendingUp className="w-8 h-8 text-blue-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-600">Monthly Revenue</p>
                    <p className="text-2xl font-bold text-blue-900">£{financialData.monthlyRevenue.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-600">Outstanding</p>
                    <p className="text-2xl font-bold text-red-900">£{financialData.outstandingPayments.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <RefreshCw className="w-8 h-8 text-orange-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-orange-600">Refunds</p>
                    <p className="text-2xl font-bold text-orange-900">£{financialData.refunds.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Payment Analytics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Payment Methods</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Stripe</span>
                      <span className="text-sm font-medium text-gray-900">{financialData.paymentMethods.stripe}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Card</span>
                      <span className="text-sm font-medium text-gray-900">{financialData.paymentMethods.card}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Bank Transfer</span>
                      <span className="text-sm font-medium text-gray-900">{financialData.paymentMethods.bank}%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Issues</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Chargebacks</span>
                      <span className="text-sm font-medium text-red-600">£{financialData.chargebacks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Failed Payments</span>
                      <span className="text-sm font-medium text-orange-600">12</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    <button className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium transition-colors">
                      Generate Report
                    </button>
                    <button className="w-full bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm font-medium transition-colors">
                      Process Refunds
                    </button>
                    <button className="w-full bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded text-sm font-medium transition-colors">
                      Update Pricing
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* System Tab */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Database Status</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">Healthy</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">API Performance</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">Optimal</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Storage Usage</span>
                    <span className="text-sm text-gray-900">85%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Last Backup</span>
                    <span className="text-sm text-gray-900">2 hours ago</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Security</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Failed Logins</span>
                    <span className="text-sm text-gray-900">3 (last 24h)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Suspicious Activity</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">None</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">SSL Certificate</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">Valid</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Create Backup
                </button>
                <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Clear Cache
                </button>
                <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  System Update
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Platform Analytics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">1,247</div>
                  <div className="text-sm text-gray-600">Total Users</div>
                  <div className="text-xs text-green-600">+12% this month</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">892</div>
                  <div className="text-sm text-gray-600">Active Users</div>
                  <div className="text-xs text-green-600">+8% this month</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">78%</div>
                  <div className="text-sm text-gray-600">Completion Rate</div>
                  <div className="text-xs text-green-600">+5% this month</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">92%</div>
                  <div className="text-sm text-gray-600">Satisfaction</div>
                  <div className="text-xs text-green-600">+3% this month</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Reports</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  User Growth Report
                </button>
                <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Revenue Analytics
                </button>
                <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Course Performance
                </button>
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Coach Effectiveness
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 