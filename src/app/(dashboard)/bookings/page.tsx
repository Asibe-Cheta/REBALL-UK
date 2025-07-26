"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Booking {
  id: string;
  courseName: string;
  trainingType: string;
  packageType: string;
  totalPrice: number;
  status: string;
  availability: Record<string, any[]>;
  consultation: boolean;
  createdAt: string;
  nextSession?: {
    date: string;
    time: string;
  };
  progress?: {
    completedSessions: number;
    totalSessions: number;
    confidenceImprovement: number;
  };
}

interface Session {
  id: string;
  date: string;
  time: string;
  status: "scheduled" | "completed" | "missed" | "rescheduled";
  notes?: string;
  confidenceBefore?: number;
  confidenceAfter?: number;
}

export default function BookingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"active" | "upcoming" | "completed" | "history">("active");

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/auth/login");
      return;
    }

    fetchBookings();
    fetchSessions();
  }, [session, status, router]);

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/bookings");
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSessions = async () => {
    try {
      const response = await fetch("/api/sessions");
      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      }
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
    }
  };

  const getActiveBookings = () => {
    return bookings.filter(booking =>
      ["confirmed", "in_progress"].includes(booking.status)
    );
  };

  const getUpcomingSessions = () => {
    return sessions.filter(session =>
      session.status === "scheduled" && new Date(session.date) > new Date()
    ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const getCompletedSessions = () => {
    return sessions.filter(session =>
      session.status === "completed"
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getBookingHistory = () => {
    return bookings.filter(booking =>
      ["completed", "cancelled"].includes(booking.status)
    );
  };

  const getDaysUntilSession = (sessionDate: string) => {
    const days = Math.ceil((new Date(sessionDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getProgressPercentage = (booking: Booking) => {
    if (!booking.progress) return 0;
    return Math.round((booking.progress.completedSessions / booking.progress.totalSessions) * 100);
  };

  const handleRescheduleSession = async (sessionId: string) => {
    // TODO: Implement rescheduling logic
    alert("Rescheduling feature coming soon!");
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      try {
        const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
          method: "POST",
        });

        if (response.ok) {
          fetchBookings();
          alert("Booking cancelled successfully");
        } else {
          alert("Failed to cancel booking");
        }
      } catch (error) {
        console.error("Failed to cancel booking:", error);
        alert("Failed to cancel booking");
      }
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-block mb-4">
            <h1 className="text-4xl font-bold text-white font-permanent-marker">
              REBALL
            </h1>
          </Link>
          <h2 className="text-2xl font-bold text-white font-permanent-marker">
            My Bookings
          </h2>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-900 rounded-lg p-1 mb-8">
          <button
            onClick={() => setActiveTab("active")}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${activeTab === "active"
                ? "bg-white text-black"
                : "text-gray-400 hover:text-white"
              }`}
          >
            Active Bookings
          </button>
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${activeTab === "upcoming"
                ? "bg-white text-black"
                : "text-gray-400 hover:text-white"
              }`}
          >
            Upcoming Sessions
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${activeTab === "completed"
                ? "bg-white text-black"
                : "text-gray-400 hover:text-white"
              }`}
          >
            Completed
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${activeTab === "history"
                ? "bg-white text-black"
                : "text-gray-400 hover:text-white"
              }`}
          >
            History
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === "active" && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-6">Active Bookings</h3>

              {getActiveBookings().length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">📋</div>
                  <h4 className="text-white text-lg mb-2">No Active Bookings</h4>
                  <p className="text-gray-400 mb-6">You don't have any active bookings at the moment.</p>
                  <Link
                    href="/booking"
                    className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Book a Course
                  </Link>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {getActiveBookings().map((booking) => (
                    <div key={booking.id} className="bg-gray-900 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-white font-semibold text-lg">{booking.courseName}</h4>
                          <p className="text-gray-400">
                            {booking.trainingType === "1v1" ? "1v1 Training" : "Group Training"}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${booking.status === "confirmed" ? "bg-green-600 text-white" : "bg-blue-600 text-white"
                          }`}>
                          {booking.status === "confirmed" ? "Confirmed" : "In Progress"}
                        </span>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Package:</span>
                          <span className="text-white">
                            {booking.packageType === "training-only" && "Training Only"}
                            {booking.packageType === "training-sisw" && "Training + SISW"}
                            {booking.packageType === "training-sisw-tav" && "Training + SISW + TAV"}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-400">Total Paid:</span>
                          <span className="text-white font-semibold">£{booking.totalPrice.toFixed(2)}</span>
                        </div>

                        {booking.progress && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Progress:</span>
                            <span className="text-white">
                              {booking.progress.completedSessions}/{booking.progress.totalSessions} sessions
                            </span>
                          </div>
                        )}
                      </div>

                      {booking.progress && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Progress</span>
                            <span className="text-white">{getProgressPercentage(booking)}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-white h-2 rounded-full transition-all duration-300"
                              style={{ width: `${getProgressPercentage(booking)}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      <div className="flex space-x-3">
                        <Link
                          href={`/bookings/${booking.id}`}
                          className="flex-1 bg-white text-black py-2 px-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="flex-1 border border-red-600 text-red-600 py-2 px-4 rounded-lg font-semibold hover:bg-red-600 hover:text-white transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "upcoming" && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-6">Upcoming Sessions</h3>

              {getUpcomingSessions().length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">📅</div>
                  <h4 className="text-white text-lg mb-2">No Upcoming Sessions</h4>
                  <p className="text-gray-400">You don't have any upcoming sessions scheduled.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {getUpcomingSessions().map((session) => (
                    <div key={session.id} className="bg-gray-900 rounded-lg p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-white font-semibold text-lg">
                            Session {session.id}
                          </h4>
                          <p className="text-gray-400">
                            {new Date(session.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "long",
                              day: "numeric"
                            })} at {session.time}
                          </p>
                          <p className="text-blue-400 text-sm">
                            {getDaysUntilSession(session.date)} days away
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleRescheduleSession(session.id)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                          >
                            Reschedule
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "completed" && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-6">Completed Sessions</h3>

              {getCompletedSessions().length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">✅</div>
                  <h4 className="text-white text-lg mb-2">No Completed Sessions</h4>
                  <p className="text-gray-400">Your completed sessions will appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {getCompletedSessions().map((session) => (
                    <div key={session.id} className="bg-gray-900 rounded-lg p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-white font-semibold text-lg">
                            Session {session.id}
                          </h4>
                          <p className="text-gray-400">
                            {new Date(session.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "long",
                              day: "numeric"
                            })} at {session.time}
                          </p>
                          {session.notes && (
                            <p className="text-gray-300 text-sm mt-2">{session.notes}</p>
                          )}
                        </div>
                        <div className="text-green-400 text-sm">✓ Completed</div>
                      </div>

                      {session.confidenceBefore && session.confidenceAfter && (
                        <div className="mt-4 p-3 bg-gray-800 rounded-lg">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Confidence Before:</span>
                            <span className="text-white">{session.confidenceBefore}/10</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Confidence After:</span>
                            <span className="text-white">{session.confidenceAfter}/10</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Improvement:</span>
                            <span className="text-green-400">+{session.confidenceAfter - session.confidenceBefore}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "history" && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-6">Booking History</h3>

              {getBookingHistory().length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">📚</div>
                  <h4 className="text-white text-lg mb-2">No Booking History</h4>
                  <p className="text-gray-400">Your booking history will appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {getBookingHistory().map((booking) => (
                    <div key={booking.id} className="bg-gray-900 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-white font-semibold text-lg">{booking.courseName}</h4>
                          <p className="text-gray-400">
                            {booking.trainingType === "1v1" ? "1v1 Training" : "Group Training"}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${booking.status === "completed" ? "bg-green-600 text-white" : "bg-red-600 text-white"
                          }`}>
                          {booking.status === "completed" ? "Completed" : "Cancelled"}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Booked On:</span>
                          <span className="text-white">
                            {new Date(booking.createdAt).toLocaleDateString("en-GB")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total Paid:</span>
                          <span className="text-white font-semibold">£{booking.totalPrice.toFixed(2)}</span>
                        </div>
                      </div>

                      <Link
                        href={`/bookings/${booking.id}`}
                        className="bg-white text-black py-2 px-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 