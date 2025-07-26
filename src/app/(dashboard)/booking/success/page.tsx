"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface BookingDetails {
  id: string;
  courseName: string;
  trainingType: string;
  packageType: string;
  totalPrice: number;
  availability: Record<string, any[]>;
  consultation: boolean;
  createdAt: string;
}

export default function BookingSuccessPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/auth/login");
      return;
    }

    const bookingId = searchParams.get("bookingId");
    if (bookingId) {
      fetchBookingDetails(bookingId);
    } else {
      router.push("/dashboard");
    }
  }, [session, status, router, searchParams]);

  const fetchBookingDetails = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`);
      if (response.ok) {
        const data = await response.json();
        setBookingDetails(data);
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Failed to fetch booking details:", error);
      router.push("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadReceipt = async () => {
    if (!bookingDetails) return;

    try {
      const response = await fetch(`/api/bookings/${bookingDetails.id}/receipt`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `REBALL-Receipt-${bookingDetails.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Failed to download receipt:", error);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!session || !bookingDetails) {
    return null;
  }

  const sessionCount = Object.keys(bookingDetails.availability || {}).length;

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="text-green-400 text-8xl mb-6">✓</div>
          <h1 className="text-4xl font-bold text-white font-permanent-marker mb-4">
            Booking Confirmed!
          </h1>
          <p className="text-gray-400 text-lg">
            Your REBALL training sessions have been successfully booked
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Booking Details */}
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Booking Details</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Booking ID:</span>
                  <span className="text-white font-mono">{bookingDetails.id}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Course:</span>
                  <span className="text-white">{bookingDetails.courseName}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Training Type:</span>
                  <span className="text-white">
                    {bookingDetails.trainingType === "1v1" ? "1v1 Training" : "Group Training"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Package:</span>
                  <span className="text-white">
                    {bookingDetails.packageType === "training-only" && "Training Only"}
                    {bookingDetails.packageType === "training-sisw" && "Training + SISW"}
                    {bookingDetails.packageType === "training-sisw-tav" && "Training + SISW + TAV"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Total Paid:</span>
                  <span className="text-white font-semibold">£{bookingDetails.totalPrice.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Sessions:</span>
                  <span className="text-white">{sessionCount} sessions</span>
                </div>

                {bookingDetails.consultation && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Consultation:</span>
                    <span className="text-green-400">Included</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-400">Booked On:</span>
                  <span className="text-white">
                    {new Date(bookingDetails.createdAt).toLocaleDateString("en-GB")}
                  </span>
                </div>
              </div>
            </div>

            {/* Session Schedule */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Session Schedule</h2>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {Object.entries(bookingDetails.availability || {}).map(([date, slots]) => (
                  <div key={date} className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                    <div>
                      <div className="text-white font-medium">
                        {new Date(date).toLocaleDateString("en-US", {
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
          </div>

          {/* Next Steps */}
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">What's Next?</h2>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    1
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Check Your Email</h3>
                    <p className="text-gray-400 text-sm">
                      We've sent you a confirmation email with all the details
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    2
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Calendar Events</h3>
                    <p className="text-gray-400 text-sm">
                      Your sessions have been added to your Google Calendar
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    3
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Prepare for Training</h3>
                    <p className="text-gray-400 text-sm">
                      Review your course materials and prepare for your first session
                    </p>
                  </div>
                </div>

                {bookingDetails.consultation && (
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      4
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Initial Consultation</h3>
                      <p className="text-gray-400 text-sm">
                        We'll contact you to schedule your consultation call
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>

              <div className="space-y-3">
                <button
                  onClick={downloadReceipt}
                  className="w-full bg-white text-black py-3 px-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Download Receipt
                </button>

                <Link
                  href="/dashboard"
                  className="block w-full bg-gray-800 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors text-center"
                >
                  Go to Dashboard
                </Link>

                <Link
                  href="/booking"
                  className="block w-full border border-gray-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors text-center"
                >
                  Book Another Course
                </Link>
              </div>
            </div>

            {/* Support */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Need Help?</h2>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span className="text-gray-400">support@reball.co.uk</span>
                </div>

                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span className="text-gray-400">+44 123 456 7890</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 