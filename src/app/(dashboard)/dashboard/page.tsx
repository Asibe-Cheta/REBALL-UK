"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface DashboardData {
  playerName: string;
  sessionsCompleted: number;
  progressPercentage: number;
  nextSession: {
    date: string;
    time: string;
    courseName: string;
    location: string;
    type: "1v1" | "group";
    countdown: number;
  } | null;
  upcomingSessions: Array<{
    id: string;
    date: string;
    time: string;
    courseName: string;
    status: "confirmed" | "pending" | "available";
  }>;
  availableCourses: Array<{
    id: string;
    name: string;
    position: string;
    price121: number;
    priceGroup: number;
    recommended: boolean;
  }>;
  recentVideos: Array<{
    id: string;
    title: string;
    thumbnail: string;
    duration: number;
    watched: number;
    category: string;
  }>;
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    unlocked: boolean;
  }>;
  confidenceData: {
    before: number;
    after: number;
    improvement: number;
  };
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/auth/login");
      return;
    }

    fetchDashboardData();
  }, [session, status, router]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/dashboard");
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCountdown = (countdown: number) => {
    const days = Math.floor(countdown / 24);
    const hours = countdown % 24;
    return `${days}d ${hours}h`;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded mb-4"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-900 rounded-lg p-6 h-64"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-lg">
                {getInitials(dashboardData?.playerName || session.user?.name || "P")}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white font-permanent-marker">
                Welcome back, {dashboardData?.playerName || session.user?.name || "Player"}
              </h1>
              <p className="text-gray-400 font-poppins">
                Ready to transform your game?
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Quick Stats */}
            <div className="hidden md:flex items-center space-x-6 text-white">
              <div className="text-center">
                <div className="text-2xl font-bold">{dashboardData?.sessionsCompleted || 0}</div>
                <div className="text-sm text-gray-400">Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{dashboardData?.progressPercentage || 0}%</div>
                <div className="text-sm text-gray-400">Progress</div>
              </div>
              {dashboardData?.nextSession && (
                <div className="text-center">
                  <div className="text-2xl font-bold">{formatCountdown(dashboardData.nextSession.countdown)}</div>
                  <div className="text-sm text-gray-400">Next Session</div>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
            >
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. Next Training Session Card */}
          <div className="lg:col-span-2 bg-gray-900 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Next Training Session</h2>
              <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                Priority
              </span>
            </div>
            
            {dashboardData?.nextSession ? (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {dashboardData.nextSession.courseName}
                    </h3>
                    <div className="space-y-2 text-gray-300">
                      <p>📅 {dashboardData.nextSession.date}</p>
                      <p>🕒 {dashboardData.nextSession.time}</p>
                      <p>📍 {dashboardData.nextSession.location}</p>
                      <p>👥 {dashboardData.nextSession.type} Training</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">
                      {formatCountdown(dashboardData.nextSession.countdown)}
                    </div>
                    <p className="text-gray-400">until session</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <button className="bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    Join Session
                  </button>
                  <button className="border border-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                    Reschedule
                  </button>
                  <button className="border border-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                    View Details
                  </button>
                  <button className="border border-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                    Add to Calendar
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">No upcoming sessions</p>
                <Link
                  href="/bookings"
                  className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Book a Session
                </Link>
              </div>
            )}
          </div>

          {/* 2. Progress Overview Card */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Progress Overview</h2>
            
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-700"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-white"
                    strokeDasharray={`${(dashboardData?.progressPercentage || 0) * 2.51} 251`}
                    strokeDashoffset="0"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{dashboardData?.progressPercentage || 0}%</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-white font-semibold mb-2">Confidence Improvement</h3>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Before</span>
                  <span className="text-white">{dashboardData?.confidenceData.before || 0}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">After</span>
                  <span className="text-white">{dashboardData?.confidenceData.after || 0}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-400">Improvement</span>
                  <span className="text-green-400">+{dashboardData?.confidenceData.improvement || 0}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Available Courses Card */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Available Courses</h2>
            
            <div className="space-y-4">
              {dashboardData?.availableCourses?.slice(0, 3).map((course) => (
                <div key={course.id} className="border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-semibold">{course.name}</h3>
                    {course.recommended && (
                      <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">Recommended</span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{course.position}</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">1v1: £{course.price121}</span>
                    <span className="text-gray-400">Group: £{course.priceGroup}</span>
                  </div>
                </div>
              ))}
              
              <Link
                href="/courses"
                className="block w-full bg-white text-black px-4 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center"
              >
                Book New Course
              </Link>
            </div>
          </div>

          {/* 4. Video Library Card */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Video Library</h2>
            
            <div className="space-y-4">
              {dashboardData?.recentVideos?.slice(0, 3).map((video) => (
                <div key={video.id} className="flex items-center space-x-3">
                  <div className="w-16 h-12 bg-gray-800 rounded flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-sm">{video.title}</h3>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{video.category}</span>
                      <span>{Math.round((video.watched / video.duration) * 100)}% watched</span>
                    </div>
                  </div>
                </div>
              ))}
              
              <Link
                href="/videos"
                className="block w-full border border-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors text-center"
              >
                View All Videos
              </Link>
            </div>
          </div>

          {/* 5. Upcoming Sessions Card */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Upcoming Sessions</h2>
            
            <div className="space-y-3">
              {dashboardData?.upcomingSessions?.slice(0, 3).map((session) => (
                <div key={session.id} className="border border-gray-700 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-white font-semibold text-sm">{session.courseName}</h3>
                    <span className={`px-2 py-1 text-xs rounded ${
                      session.status === 'confirmed' ? 'bg-green-600 text-white' :
                      session.status === 'pending' ? 'bg-yellow-600 text-white' :
                      'bg-gray-600 text-white'
                    }`}>
                      {session.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">{session.date} at {session.time}</p>
                </div>
              ))}
              
              <Link
                href="/bookings"
                className="block w-full border border-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors text-center"
              >
                View All Sessions
              </Link>
            </div>
          </div>

          {/* 6. Achievements & Certificates Card */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Achievements</h2>
            
            <div className="space-y-4">
              {dashboardData?.achievements?.slice(0, 3).map((achievement) => (
                <div key={achievement.id} className={`flex items-center space-x-3 p-3 rounded-lg ${
                  achievement.unlocked ? 'bg-green-900/20 border border-green-600' : 'bg-gray-800 border border-gray-700'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    achievement.unlocked ? 'bg-green-600' : 'bg-gray-600'
                  }`}>
                    <span className="text-white text-sm">{achievement.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold text-sm ${
                      achievement.unlocked ? 'text-white' : 'text-gray-400'
                    }`}>
                      {achievement.title}
                    </h3>
                    <p className="text-xs text-gray-400">{achievement.description}</p>
                  </div>
                </div>
              ))}
              
              <div className="flex space-x-2">
                <button className="flex-1 border border-gray-600 text-white px-3 py-2 rounded text-sm hover:bg-gray-800 transition-colors">
                  Download Certificates
                </button>
                <button className="flex-1 border border-gray-600 text-white px-3 py-2 rounded text-sm hover:bg-gray-800 transition-colors">
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="mt-8 grid md:grid-cols-4 gap-4">
          <Link
            href="/profile"
            className="bg-gray-900 rounded-lg p-4 text-center hover:bg-gray-800 transition-colors"
          >
            <div className="text-white font-semibold mb-2">Profile</div>
            <div className="text-gray-400 text-sm">Manage your account</div>
          </Link>
          
          <Link
            href="/bookings"
            className="bg-gray-900 rounded-lg p-4 text-center hover:bg-gray-800 transition-colors"
          >
            <div className="text-white font-semibold mb-2">Bookings</div>
            <div className="text-gray-400 text-sm">Schedule sessions</div>
          </Link>
          
          <Link
            href="/videos"
            className="bg-gray-900 rounded-lg p-4 text-center hover:bg-gray-800 transition-colors"
          >
            <div className="text-white font-semibold mb-2">Videos</div>
            <div className="text-gray-400 text-sm">Training content</div>
          </Link>
          
          <Link
            href="/progress"
            className="bg-gray-900 rounded-lg p-4 text-center hover:bg-gray-800 transition-colors"
          >
            <div className="text-white font-semibold mb-2">Progress</div>
            <div className="text-gray-400 text-sm">Track improvements</div>
          </Link>
        </div>
      </div>
    </div>
  );
} 