"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface BookingData {
  id: string;
  courseName: string;
  trainingType: "1v1" | "group";
  selectedPackage: string;
  totalPrice: number;
  availability: Record<string, any[]>;
  consultation: boolean;
  answers: Record<string, string>;
}

interface CoachInfo {
  name: string;
  email: string;
  phone: string;
  bio: string;
  image: string;
}

export default function BookingConfirmationPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(true);
  const [coachInfo, setCoachInfo] = useState<CoachInfo | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/auth/login");
      return;
    }

    // Get booking data from URL params
    const bookingDataParam = searchParams.get("data");
    if (bookingDataParam) {
      try {
        const data = JSON.parse(decodeURIComponent(bookingDataParam));
        setBookingData(data);
        fetchCoachInfo();
      } catch (error) {
        console.error("Failed to parse booking data:", error);
        router.push("/booking");
      }
    } else {
      router.push("/booking");
    }

    // Hide success animation after 3 seconds
    setTimeout(() => {
      setShowSuccessAnimation(false);
    }, 3000);
  }, [session, status, router, searchParams]);

  const fetchCoachInfo = async () => {
    try {
      const response = await fetch("/api/coaches/assigned");
      if (response.ok) {
        const data = await response.json();
        setCoachInfo(data);
      }
    } catch (error) {
      console.error("Failed to fetch coach info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadReceipt = async () => {
    if (!bookingData) return;
    
    try {
      const response = await fetch("/api/bookings/receipt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `REBALL-Receipt-${bookingData.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Failed to download receipt:", error);
    }
  };

  const addToCalendar = async () => {
    if (!bookingData) return;
    
    try {
      const response = await fetch("/api/calendar/bulk-create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingData,
          coachInfo,
        }),
      });
      
      if (response.ok) {
        alert("All sessions have been added to your Google Calendar!");
      } else {
        alert("Failed to add sessions to calendar. Please try again.");
      }
    } catch (error) {
      console.error("Failed to add to calendar:", error);
      alert("Failed to add sessions to calendar. Please try again.");
    }
  };

  const shareAchievement = () => {
    const text = `Just booked my REBALL training course! 🏈 Can't wait to improve my ${bookingData?.courseName} skills! #REBALL #FootballTraining`;
    const url = window.location.origin;
    
    if (navigator.share) {
      navigator.share({
        title: "REBALL Training Booking",
        text,
        url,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
      window.open(shareUrl, '_blank');
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading booking confirmation...</p>
        </div>
      </div>
    );
  }

  if (!session || !bookingData) {
    return null;
  }

  const sessionCount = Object.keys(bookingData.availability || {}).length;
  const firstSession = Object.entries(bookingData.availability || {})[0];

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        {/* Success Animation */}
        {showSuccessAnimation && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
            <div className="text-center">
              <div className="text-green-400 text-9xl mb-6 animate-bounce">✓</div>
              <h1 className="text-4xl font-bold text-white font-permanent-marker mb-4">
                Booking Confirmed!
              </h1>
              <p className="text-gray-400 text-xl">
                Welcome to REBALL Training
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white font-permanent-marker mb-4">
            REBALL
          </h1>
          <h2 className="text-2xl font-bold text-white font-permanent-marker">
            Booking Confirmation
          </h2>
          <p className="text-gray-400 mt-2">
            Your training journey starts now
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Booking Summary */}
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Booking Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Booking ID:</span>
                  <span className="text-white font-mono">{bookingData.id}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Course:</span>
                  <span className="text-white">{bookingData.courseName}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Training Type:</span>
                  <span className="text-white">
                    {bookingData.trainingType === "1v1" ? "1v1 Training" : "Group Training"}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Package:</span>
                  <span className="text-white">
                    {bookingData.selectedPackage === "training-only" && "Training Only"}
                    {bookingData.selectedPackage === "training-sisw" && "Training + SISW"}
                    {bookingData.selectedPackage === "training-sisw-tav" && "Training + SISW + TAV"}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Paid:</span>
                  <span className="text-white font-semibold">£{bookingData.totalPrice.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Sessions:</span>
                  <span className="text-white">{sessionCount} sessions</span>
                </div>
                
                {bookingData.consultation && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Consultation:</span>
                    <span className="text-green-400">Included</span>
                  </div>
                )}
              </div>
            </div>

            {/* Session Schedule */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Session Schedule</h3>
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {Object.entries(bookingData.availability || {}).map(([date, slots], index) => (
                  <div key={date} className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                    <div>
                      <div className="text-white font-medium">
                        Session {index + 1} - {new Date(date).toLocaleDateString("en-US", { 
                          weekday: "long", 
                          month: "long", 
                          day: "numeric" 
                        })}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {slots.map((slot: any) => slot.time).join(", ")}
                      </div>
                    </div>
                    <div className="text-green-400 text-sm">✓ Confirmed</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coach Information */}
            {coachInfo && (
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Your Coach</h3>
                
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-xl">
                    {coachInfo.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{coachInfo.name}</h4>
                    <p className="text-gray-400 text-sm">{coachInfo.bio}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-gray-400 text-sm">{coachInfo.email}</span>
                      <span className="text-gray-400 text-sm">{coachInfo.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Location Details */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Training Location</h3>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-gray-400 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="text-white font-medium">REBALL Training Ground</h4>
                    <p className="text-gray-400 text-sm">123 Football Lane, London, SW1A 1AA</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-gray-400 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="text-white font-medium">Arrival Time</h4>
                    <p className="text-gray-400 text-sm">Please arrive 15 minutes before your session</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-gray-400 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="text-white font-medium">What to Bring</h4>
                    <p className="text-gray-400 text-sm">Football boots, comfortable clothing, water bottle</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons & Next Steps */}
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <button
                  onClick={downloadReceipt}
                  className="w-full bg-white text-black py-3 px-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>Download Receipt</span>
                </button>
                
                <button
                  onClick={addToCalendar}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span>Add to Calendar</span>
                </button>
                
                <button
                  onClick={shareAchievement}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                  </svg>
                  <span>Share Achievement</span>
                </button>
                
                <Link
                  href="/dashboard"
                  className="block w-full bg-gray-800 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors text-center"
                >
                  Go to Dashboard
                </Link>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">What's Next?</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    1
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Check Your Email</h4>
                    <p className="text-gray-400 text-sm">
                      We've sent you a detailed confirmation email with all the information
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    2
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Prepare for Your First Session</h4>
                    <p className="text-gray-400 text-sm">
                      Review your course materials and get ready for training
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    3
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Meet Your Coach</h4>
                    <p className="text-gray-400 text-sm">
                      Your coach will contact you before your first session
                    </p>
                  </div>
                </div>
                
                {bookingData.consultation && (
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      4
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Initial Consultation</h4>
                      <p className="text-gray-400 text-sm">
                        We'll schedule your consultation call within 24 hours
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* First Session Countdown */}
            {firstSession && (
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">First Session</h3>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    {new Date(firstSession[0]).toLocaleDateString("en-US", { 
                      weekday: "long", 
                      month: "long", 
                      day: "numeric" 
                    })}
                  </div>
                  <div className="text-gray-400">
                    {firstSession[1].map((slot: any) => slot.time).join(", ")}
                  </div>
                  <div className="mt-4 text-sm text-gray-400">
                    {Math.ceil((new Date(firstSession[0]).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days away
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 