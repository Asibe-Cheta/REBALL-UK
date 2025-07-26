"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  spots: number;
  maxSpots: number;
  isConsultation?: boolean;
}

interface SessionDate {
  date: string;
  dayName: string;
  dayNumber: number;
  month: string;
  year: number;
  timeSlots: TimeSlot[];
}

interface BookingData {
  trainingType: "1v1" | "group";
  selectedCourse: any;
  selectedPackage: string;
  answers: Record<string, string>;
}

export default function AvailabilityPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isLoading, setIsLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<Record<string, TimeSlot[]>>({});
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [calendarView, setCalendarView] = useState<"month" | "week">("month");
  const [showConsultation, setShowConsultation] = useState(false);
  const [googleCalendarConnected, setGoogleCalendarConnected] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/auth/login");
      return;
    }

    // Get booking data from URL params or localStorage
    const bookingDataParam = searchParams.get("bookingData");
    if (bookingDataParam) {
      try {
        setBookingData(JSON.parse(decodeURIComponent(bookingDataParam)));
      } catch (error) {
        console.error("Failed to parse booking data:", error);
      }
    }

    fetchAvailability();
    checkGoogleCalendarConnection();
  }, [session, status, router, searchParams]);

  const fetchAvailability = async () => {
    try {
      const response = await fetch("/api/availability");
      if (response.ok) {
        // Mock availability data - replace with actual API response
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Failed to fetch availability:", error);
      setIsLoading(false);
    }
  };

  const checkGoogleCalendarConnection = async () => {
    try {
      const response = await fetch("/api/calendar/status");
      if (response.ok) {
        const data = await response.json();
        setGoogleCalendarConnected(data.connected);
      }
    } catch (error) {
      console.error("Failed to check calendar connection:", error);
    }
  };

  const generateCalendarDays = (date: Date): SessionDate[] => {
    const days: SessionDate[] = [];
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const dayName = currentDate.toLocaleDateString("en-US", { weekday: "short" });
      const dayNumber = currentDate.getDate();
      const monthName = currentDate.toLocaleDateString("en-US", { month: "short" });
      const yearNumber = currentDate.getFullYear();
      const dateString = currentDate.toISOString().split("T")[0];

      // Generate time slots for each day
      const timeSlots: TimeSlot[] = [
        { id: `${dateString}-09:00`, time: "09:00", available: true, spots: 3, maxSpots: 4 },
        { id: `${dateString}-11:00`, time: "11:00", available: true, spots: 2, maxSpots: 4 },
        { id: `${dateString}-14:00`, time: "14:00", available: true, spots: 4, maxSpots: 4 },
        { id: `${dateString}-16:00`, time: "16:00", available: true, spots: 1, maxSpots: 4 },
        { id: `${dateString}-18:00`, time: "18:00", available: false, spots: 0, maxSpots: 4 },
      ];

      days.push({
        date: dateString,
        dayName,
        dayNumber,
        month: monthName,
        year: yearNumber,
        timeSlots,
      });
    }

    return days;
  };

  const handleDateSelection = (date: string, timeSlot: TimeSlot) => {
    setSelectedDates(prev => {
      const current = prev[date] || [];
      const isSelected = current.some(slot => slot.id === timeSlot.id);
      
      if (isSelected) {
        // Remove time slot
        const updated = current.filter(slot => slot.id !== timeSlot.id);
        if (updated.length === 0) {
          const { [date]: removed, ...rest } = prev;
          return rest;
        }
        return { ...prev, [date]: updated };
      } else {
        // Add time slot
        return { ...prev, [date]: [...current, timeSlot] };
      }
    });
  };

  const handleBulkSelection = (startDate: string, timeSlot: TimeSlot) => {
    // Select same time slot for 8 consecutive weeks
    const selectedSlots: Record<string, TimeSlot[]> = {};
    const start = new Date(startDate);
    
    for (let i = 0; i < 8; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + (i * 7));
      const dateString = currentDate.toISOString().split("T")[0];
      
      const slot: TimeSlot = {
        ...timeSlot,
        id: `${dateString}-${timeSlot.time}`,
      };
      
      selectedSlots[dateString] = [slot];
    }
    
    setSelectedDates(selectedSlots);
  };

  const connectGoogleCalendar = async () => {
    try {
      const response = await fetch("/api/calendar/connect");
      if (response.ok) {
        const data = await response.json();
        window.location.href = data.authUrl;
      }
    } catch (error) {
      console.error("Failed to connect Google Calendar:", error);
    }
  };

  const getAvailabilityColor = (timeSlot: TimeSlot) => {
    if (!timeSlot.available) return "bg-red-600";
    if (timeSlot.spots === 0) return "bg-red-500";
    if (timeSlot.spots <= 1) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getSelectedSessionsCount = () => {
    return Object.values(selectedDates).flat().length;
  };

  const handleContinue = () => {
    if (getSelectedSessionsCount() === 0) {
      alert("Please select at least one session time.");
      return;
    }

    // Prepare booking data for confirmation
    const bookingDataWithAvailability = {
      ...bookingData,
      availability: selectedDates,
      consultation: showConsultation,
    };

    router.push(`/booking/confirm?data=${encodeURIComponent(JSON.stringify(bookingDataWithAvailability))}`);
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading availability...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const calendarDays = generateCalendarDays(currentMonth);
  const selectedCount = getSelectedSessionsCount();

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/booking" className="inline-block mb-4">
            <h1 className="text-4xl font-bold text-white font-permanent-marker">
              REBALL
            </h1>
          </Link>
          <h2 className="text-2xl font-bold text-white font-permanent-marker">
            Select Your Availability
          </h2>
          <p className="text-gray-400 mt-2">
            Choose your preferred training times for the next 8 weeks
          </p>
        </div>

        {/* Google Calendar Integration */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Google Calendar Integration</h3>
              <p className="text-gray-400 text-sm">
                {googleCalendarConnected 
                  ? "Connected - We'll sync your sessions automatically"
                  : "Connect your Google Calendar to avoid scheduling conflicts"
                }
              </p>
            </div>
            {!googleCalendarConnected && (
              <button
                onClick={connectGoogleCalendar}
                className="bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Connect Calendar
              </button>
            )}
          </div>
        </div>

        {/* Calendar Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              className="p-2 text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <h3 className="text-xl font-semibold text-white">
              {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </h3>
            
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              className="p-2 text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Available</span>
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span>Limited</span>
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>Booked</span>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          {/* Calendar Header */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
              <div key={day} className="text-center text-gray-400 text-sm font-medium py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`min-h-32 border border-gray-700 rounded-lg p-2 ${
                  day.month !== currentMonth.toLocaleDateString("en-US", { month: "short" })
                    ? "opacity-50"
                    : ""
                }`}
              >
                <div className="text-center mb-2">
                  <div className="text-white font-semibold">{day.dayNumber}</div>
                  <div className="text-gray-400 text-xs">{day.dayName}</div>
                </div>

                {/* Time Slots */}
                <div className="space-y-1">
                  {day.timeSlots.map(timeSlot => {
                    const isSelected = selectedDates[day.date]?.some(slot => slot.id === timeSlot.id);
                    return (
                      <button
                        key={timeSlot.id}
                        onClick={() => handleDateSelection(day.date, timeSlot)}
                        className={`w-full text-xs p-1 rounded transition-all ${
                          isSelected
                            ? "bg-white text-black font-semibold"
                            : timeSlot.available
                            ? "bg-gray-800 text-white hover:bg-gray-700"
                            : "bg-gray-700 text-gray-500 cursor-not-allowed"
                        }`}
                        disabled={!timeSlot.available}
                      >
                        <div className="flex items-center justify-between">
                          <span>{timeSlot.time}</span>
                          <div className={`w-2 h-2 rounded-full ${getAvailabilityColor(timeSlot)}`}></div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <button
              onClick={() => {
                // Select first available slot for next 8 weeks
                const firstAvailable = calendarDays.find(day => 
                  day.timeSlots.some(slot => slot.available)
                );
                if (firstAvailable) {
                  const firstSlot = firstAvailable.timeSlots.find(slot => slot.available);
                  if (firstSlot) {
                    handleBulkSelection(firstAvailable.date, firstSlot);
                  }
                }
              }}
              className="bg-white text-black px-4 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Auto-Select 8 Weeks
            </button>
            
            <button
              onClick={() => setSelectedDates({})}
              className="border border-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Clear All
            </button>
            
            <button
              onClick={() => setShowConsultation(!showConsultation)}
              className={`px-4 py-3 rounded-lg font-semibold transition-colors ${
                showConsultation
                  ? "bg-blue-600 text-white"
                  : "border border-gray-600 text-white hover:bg-gray-800"
              }`}
            >
              {showConsultation ? "✓" : "+"} Add Consultation
            </button>
          </div>
        </div>

        {/* Consultation Details */}
        {showConsultation && (
          <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Initial Consultation</h3>
            <p className="text-gray-400 mb-4">
              We'll schedule a 30-minute video call to discuss your training goals and create a personalized plan.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Preferred Consultation Time</label>
                <select className="w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent">
                  <option value="">Select time</option>
                  <option value="morning">Morning (9 AM - 12 PM)</option>
                  <option value="afternoon">Afternoon (2 PM - 5 PM)</option>
                  <option value="evening">Evening (6 PM - 8 PM)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Video Platform</label>
                <select className="w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent">
                  <option value="zoom">Zoom</option>
                  <option value="google-meet">Google Meet</option>
                  <option value="teams">Microsoft Teams</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Selected Sessions Summary */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Selected Sessions</h3>
            <span className="text-gray-400">{selectedCount} sessions selected</span>
          </div>
          
          {selectedCount > 0 && (
            <div className="space-y-2">
              {Object.entries(selectedDates).map(([date, slots]) => (
                <div key={date} className="flex items-center justify-between text-sm">
                  <span className="text-white">
                    {new Date(date).toLocaleDateString("en-US", { 
                      weekday: "long", 
                      month: "short", 
                      day: "numeric" 
                    })}
                  </span>
                  <span className="text-gray-400">
                    {slots.map(slot => slot.time).join(", ")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/booking"
            className="px-6 py-3 border border-gray-600 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back
          </Link>

          <div className="flex items-center space-x-4">
            <span className="text-gray-400">
              {selectedCount} sessions selected
            </span>
            <button
              onClick={handleContinue}
              disabled={selectedCount === 0}
              className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 