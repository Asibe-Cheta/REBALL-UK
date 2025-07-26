"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    router.push("/auth/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-bold text-white font-permanent-marker">
              REBALL
            </h1>
          </Link>
          <h2 className="mt-6 text-2xl font-bold text-white font-permanent-marker">
            Welcome to Your Dashboard
          </h2>
          <p className="mt-2 text-gray-400 font-poppins">
            Hello, {session.user?.name || "Player"}! Ready to transform your game?
          </p>
        </div>

        {/* Dashboard Content */}
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/training"
                  className="block w-full bg-white text-black px-4 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center"
                >
                  Start Training
                </Link>
                <Link
                  href="/profile"
                  className="block w-full border border-gray-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors text-center"
                >
                  View Profile
                </Link>
                <Link
                  href="/bookings"
                  className="block w-full border border-gray-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors text-center"
                >
                  My Bookings
                </Link>
              </div>
            </div>

            {/* Progress Overview */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Your Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Training Sessions</span>
                    <span className="text-white">0/8</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "0%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Skills Mastered</span>
                    <span className="text-white">0</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "0%" }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="text-sm text-gray-400">
                  <p>Welcome to REBALL!</p>
                  <p className="text-xs text-gray-500">Just now</p>
                </div>
                <div className="text-sm text-gray-400">
                  <p>Profile completed</p>
                  <p className="text-xs text-gray-500">Just now</p>
                </div>
              </div>
            </div>
          </div>

          {/* Getting Started */}
          <div className="mt-8 bg-gray-900 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Getting Started</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-medium text-white mb-2">1. Book Your First Session</h4>
                <p className="text-gray-400 text-sm mb-3">
                  Choose from our available training sessions and book your first appointment with our expert coaches.
                </p>
                <Link
                  href="/bookings"
                  className="inline-block bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm"
                >
                  Book Now
                </Link>
              </div>
              <div>
                <h4 className="text-lg font-medium text-white mb-2">2. Explore Training Videos</h4>
                <p className="text-gray-400 text-sm mb-3">
                  Watch our training highlights and learn from professional players to improve your skills.
                </p>
                <Link
                  href="/training"
                  className="inline-block bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm"
                >
                  Watch Videos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 