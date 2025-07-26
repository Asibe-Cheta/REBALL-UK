"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// Load Stripe (will be configured with publishable key)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface BookingData {
  trainingType: "1v1" | "group";
  selectedCourse: any;
  selectedPackage: string;
  answers: Record<string, string>;
  availability: Record<string, any[]>;
  consultation: boolean;
}

interface PaymentFormProps {
  bookingData: BookingData;
  totalPrice: number;
  onPaymentSuccess: (paymentIntent: any) => void;
  onPaymentError: (error: string) => void;
}

function PaymentForm({ bookingData, totalPrice, onPaymentSuccess, onPaymentError }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "apple-pay" | "google-pay">("card");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Create payment intent
      const response = await fetch("/api/payment/create-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: totalPrice * 100, // Convert to cents
          bookingData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create payment intent");
      }

      const { clientSecret } = await response.json();

      // Confirm payment
      const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
            billing_details: {
              name: bookingData.selectedCourse?.name || "REBALL Training",
            },
          },
        }
      );

      if (paymentError) {
        setError(paymentError.message || "Payment failed");
        onPaymentError(paymentError.message || "Payment failed");
      } else if (paymentIntent.status === "succeeded") {
        onPaymentSuccess(paymentIntent);
      }
    } catch (err: any) {
      setError(err.message || "Payment failed");
      onPaymentError(err.message || "Payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#ffffff",
        fontFamily: "Poppins, sans-serif",
        "::placeholder": {
          color: "#9ca3af",
        },
        backgroundColor: "transparent",
      },
      invalid: {
        color: "#ef4444",
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Method Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Payment Method</h3>

        <div className="grid grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => setPaymentMethod("card")}
            className={`p-4 border-2 rounded-lg transition-all ${paymentMethod === "card"
                ? "border-white bg-gray-800"
                : "border-gray-600 bg-gray-900 hover:border-gray-500"
              }`}
          >
            <div className="text-center">
              <div className="text-2xl mb-2">💳</div>
              <div className="text-white font-medium">Card</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod("apple-pay")}
            className={`p-4 border-2 rounded-lg transition-all ${paymentMethod === "apple-pay"
                ? "border-white bg-gray-800"
                : "border-gray-600 bg-gray-900 hover:border-gray-500"
              }`}
          >
            <div className="text-center">
              <div className="text-2xl mb-2">🍎</div>
              <div className="text-white font-medium">Apple Pay</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod("google-pay")}
            className={`p-4 border-2 rounded-lg transition-all ${paymentMethod === "google-pay"
                ? "border-white bg-gray-800"
                : "border-gray-600 bg-gray-900 hover:border-gray-500"
              }`}
          >
            <div className="text-center">
              <div className="text-2xl mb-2">📱</div>
              <div className="text-white font-medium">Google Pay</div>
            </div>
          </button>
        </div>
      </div>

      {/* Card Input */}
      {paymentMethod === "card" && (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-white">
            Card Details
          </label>
          <div className="border border-gray-600 rounded-lg p-4 bg-gray-800">
            <CardElement options={cardElementOptions} />
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-600 text-white p-4 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isProcessing || !stripe}
        className="w-full bg-white text-black py-4 px-6 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
            Processing Payment...
          </div>
        ) : (
          `Pay £${totalPrice.toFixed(2)}`
        )}
      </button>

      {/* Security Notice */}
      <div className="text-center text-gray-400 text-sm">
        <div className="flex items-center justify-center mb-2">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          Secure Payment
        </div>
        <p>Your payment information is encrypted and secure</p>
      </div>
    </form>
  );
}

export default function PaymentPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

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
        calculateTotalPrice(data);
      } catch (error) {
        console.error("Failed to parse booking data:", error);
        router.push("/booking");
      }
    } else {
      router.push("/booking");
    }
  }, [session, status, router, searchParams]);

  const calculateTotalPrice = (data: BookingData) => {
    let basePrice = data.trainingType === "1v1" ? 400 : 280;
    let total = basePrice;

    if (data.selectedPackage.includes("sisw")) {
      total += 40;
    }

    if (data.selectedPackage.includes("tav")) {
      total *= 2; // Double for TAV
    }

    setTotalPrice(total);
  };

  const handlePaymentSuccess = async (paymentIntent: any) => {
    try {
      // Create booking in database
      const response = await fetch("/api/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...bookingData,
          paymentIntentId: paymentIntent.id,
          totalPrice,
        }),
      });

      if (response.ok) {
        const booking = await response.json();
        setPaymentSuccess(true);

        // Redirect to success page after a delay
        setTimeout(() => {
          router.push(`/booking/success?bookingId=${booking.id}`);
        }, 2000);
      } else {
        setPaymentError("Failed to create booking");
      }
    } catch (error) {
      setPaymentError("Failed to create booking");
    }
  };

  const handlePaymentError = (error: string) => {
    setPaymentError(error);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading payment...</p>
        </div>
      </div>
    );
  }

  if (!session || !bookingData) {
    return null;
  }

  const selectedSessions = Object.entries(bookingData.availability || {}).length;

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/booking/availability" className="inline-block mb-4">
            <h1 className="text-4xl font-bold text-white font-permanent-marker">
              REBALL
            </h1>
          </Link>
          <h2 className="text-2xl font-bold text-white font-permanent-marker">
            Complete Your Payment
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="bg-gray-900 rounded-lg p-8">
            <h3 className="text-xl font-semibold text-white mb-6">Payment Details</h3>

            <Elements stripe={stripePromise}>
              <PaymentForm
                bookingData={bookingData}
                totalPrice={totalPrice}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
              />
            </Elements>
          </div>

          {/* Booking Summary */}
          <div className="space-y-6">
            {/* Course Details */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Booking Summary</h3>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Course:</span>
                  <span className="text-white font-medium">{bookingData.selectedCourse?.name}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Training Type:</span>
                  <span className="text-white font-medium">
                    {bookingData.trainingType === "1v1" ? "1v1 Training" : "Group Training"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Package:</span>
                  <span className="text-white font-medium">
                    {bookingData.selectedPackage === "training-only" && "Training Only"}
                    {bookingData.selectedPackage === "training-sisw" && "Training + SISW"}
                    {bookingData.selectedPackage === "training-sisw-tav" && "Training + SISW + TAV"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Sessions:</span>
                  <span className="text-white font-medium">{selectedSessions} sessions</span>
                </div>

                {bookingData.consultation && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Consultation:</span>
                    <span className="text-white font-medium">Included</span>
                  </div>
                )}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Price Breakdown</h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Base Price:</span>
                  <span className="text-white">
                    £{bookingData.trainingType === "1v1" ? "400.00" : "280.00"}
                  </span>
                </div>

                {bookingData.selectedPackage.includes("sisw") && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">SISW Addon:</span>
                    <span className="text-white">+£40.00</span>
                  </div>
                )}

                {bookingData.selectedPackage.includes("tav") && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">TAV Addon:</span>
                    <span className="text-white">×2</span>
                  </div>
                )}

                <div className="border-t border-gray-700 pt-3">
                  <div className="flex justify-between">
                    <span className="text-white font-semibold">Total:</span>
                    <span className="text-white font-semibold text-xl">£{totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Session Schedule */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Session Schedule</h3>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {Object.entries(bookingData.availability || {}).map(([date, slots]) => (
                  <div key={date} className="flex justify-between text-sm">
                    <span className="text-gray-400">
                      {new Date(date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric"
                      })}
                    </span>
                    <span className="text-white">
                      {slots.map((slot: any) => slot.time).join(", ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="bg-gray-900 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 text-white bg-gray-800 border-gray-600 rounded focus:ring-white focus:ring-2"
                />
                <label htmlFor="terms" className="text-sm text-gray-300">
                  I agree to the{" "}
                  <Link href="/terms" className="text-white hover:underline">
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-white hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {paymentSuccess && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-lg p-8 text-center">
              <div className="text-green-400 text-6xl mb-4">✓</div>
              <h3 className="text-xl font-semibold text-white mb-2">Payment Successful!</h3>
              <p className="text-gray-400">Redirecting to booking confirmation...</p>
            </div>
          </div>
        )}

        {paymentError && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-lg p-8 text-center">
              <div className="text-red-400 text-6xl mb-4">✗</div>
              <h3 className="text-xl font-semibold text-white mb-2">Payment Failed</h3>
              <p className="text-gray-400 mb-4">{paymentError}</p>
              <button
                onClick={() => setPaymentError(null)}
                className="bg-white text-black px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 