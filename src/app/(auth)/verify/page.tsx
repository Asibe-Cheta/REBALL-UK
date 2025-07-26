"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";

type VerificationState = "pending" | "success" | "failed" | "expired" | "loading";

interface VerificationData {
  email?: string;
  token?: string;
  error?: string;
}

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const [verificationState, setVerificationState] = useState<VerificationState>("loading");
  const [verificationData, setVerificationData] = useState<VerificationData>({});
  const [countdown, setCountdown] = useState(60);
  const [redirectCountdown, setRedirectCountdown] = useState(5);
  const [isResending, setIsResending] = useState(false);
  const [resendAttempts, setResendAttempts] = useState(0);

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  useEffect(() => {
    if (token) {
      verifyToken(token);
    } else {
      setVerificationState("pending");
      setVerificationData({ email: email || "" });
    }
  }, [token, email]);

  useEffect(() => {
    if (verificationState === "pending" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, verificationState]);

  useEffect(() => {
    if (verificationState === "success" && redirectCountdown > 0) {
      const timer = setTimeout(() => setRedirectCountdown(redirectCountdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (verificationState === "success" && redirectCountdown === 0) {
      router.push("/auth/welcome");
    }
  }, [redirectCountdown, verificationState, router]);

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        setVerificationState("success");
        // Update session if user is logged in
        if (session) {
          await signIn("credentials", { redirect: false });
        }
      } else {
        if (response.status === 400 && data.message.includes("expired")) {
          setVerificationState("expired");
        } else {
          setVerificationState("failed");
          setVerificationData({ error: data.message });
        }
      }
    } catch (error) {
      setVerificationState("failed");
      setVerificationData({ error: "An unexpected error occurred" });
    }
  };

  const handleResendVerification = async () => {
    if (resendAttempts >= 3) {
      setVerificationData({ error: "Too many resend attempts. Please try again later." });
      return;
    }

    setIsResending(true);
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: verificationData.email }),
      });

      const data = await response.json();

      if (response.ok) {
        setResendAttempts(prev => prev + 1);
        setCountdown(60);
        setVerificationData({ email: verificationData.email });
        setVerificationState("pending");
      } else {
        setVerificationData({ error: data.message });
      }
    } catch (error) {
      setVerificationData({ error: "Failed to resend verification email" });
    } finally {
      setIsResending(false);
    }
  };

  const handleContinue = () => {
    router.push("/auth/welcome");
  };

  const renderPendingState = () => (
    <div className="text-center space-y-6">
      <div className="mx-auto w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white font-permanent-marker mb-2">
          Check Your Email
        </h2>
        <p className="text-gray-400 font-poppins">
          We've sent a verification link to{" "}
          <span className="text-white font-semibold">{verificationData.email}</span>
        </p>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 space-y-3">
        <h3 className="text-white font-semibold">Can't find the email?</h3>
        <ul className="text-sm text-gray-400 space-y-2 text-left">
          <li className="flex items-start">
            <span className="text-white mr-2">•</span>
            Check your spam or junk folder
          </li>
          <li className="flex items-start">
            <span className="text-white mr-2">•</span>
            Make sure the email address is correct
          </li>
          <li className="flex items-start">
            <span className="text-white mr-2">•</span>
            Wait a few minutes for the email to arrive
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        {countdown > 0 ? (
          <p className="text-sm text-gray-400">
            Resend available in {countdown} seconds
          </p>
        ) : (
          <button
            onClick={handleResendVerification}
            disabled={isResending}
            className="w-full bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            {isResending ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                Resending...
              </div>
            ) : (
              "Resend Verification Email"
            )}
          </button>
        )}

        <Link
          href="/auth/register"
          className="block text-sm text-gray-400 hover:text-white transition-colors"
        >
          Back to Registration
        </Link>
      </div>
    </div>
  );

  const renderSuccessState = () => (
    <div className="text-center space-y-6">
      <div className="mx-auto w-16 h-16 bg-green-900/20 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white font-permanent-marker mb-2">
          Welcome to REBALL!
        </h2>
        <p className="text-gray-400 font-poppins">
          Your email has been verified successfully.
        </p>
      </div>

      <div className="bg-gray-800 rounded-lg p-4">
        <p className="text-sm text-gray-400 mb-4">
          Redirecting to your welcome page in {redirectCountdown} seconds...
        </p>
        <button
          onClick={handleContinue}
          className="w-full bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Continue Now
        </button>
      </div>
    </div>
  );

  const renderFailedState = () => (
    <div className="text-center space-y-6">
      <div className="mx-auto w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white font-permanent-marker mb-2">
          Verification Failed
        </h2>
        <p className="text-gray-400 font-poppins mb-4">
          {verificationData.error || "Unable to verify your email address."}
        </p>
      </div>

      <div className="space-y-4">
        <button
          onClick={handleResendVerification}
          disabled={isResending}
          className="w-full bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          {isResending ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
              Sending...
            </div>
          ) : (
            "Resend Verification Email"
          )}
        </button>

        <Link
          href="/auth/register"
          className="block text-sm text-gray-400 hover:text-white transition-colors"
        >
          Back to Registration
        </Link>

        <div className="pt-4 border-t border-gray-700">
          <p className="text-sm text-gray-400 mb-2">Need help?</p>
          <a
            href="mailto:support@reball.co.uk"
            className="text-sm text-white hover:text-gray-300 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );

  const renderExpiredState = () => (
    <div className="text-center space-y-6">
      <div className="mx-auto w-16 h-16 bg-yellow-900/20 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white font-permanent-marker mb-2">
          Link Expired
        </h2>
        <p className="text-gray-400 font-poppins">
          This verification link has expired. Please request a new one.
        </p>
      </div>

      <div className="space-y-4">
        <button
          onClick={handleResendVerification}
          disabled={isResending}
          className="w-full bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          {isResending ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
              Sending...
            </div>
          ) : (
            "Send New Verification Email"
          )}
        </button>

        <Link
          href="/auth/register"
          className="block text-sm text-gray-400 hover:text-white transition-colors"
        >
          Back to Registration
        </Link>
      </div>
    </div>
  );

  const renderLoadingState = () => (
    <div className="text-center space-y-6">
      <div className="mx-auto w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white font-permanent-marker mb-2">
          Verifying Email
        </h2>
        <p className="text-gray-400 font-poppins">
          Please wait while we verify your email address...
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-bold text-white font-permanent-marker">
              REBALL
            </h1>
          </Link>
        </div>

        {/* Verification Content */}
        <div className="bg-gray-900 rounded-lg p-8">
          {verificationState === "loading" && renderLoadingState()}
          {verificationState === "pending" && renderPendingState()}
          {verificationState === "success" && renderSuccessState()}
          {verificationState === "failed" && renderFailedState()}
          {verificationState === "expired" && renderExpiredState()}
        </div>

        {/* Footer */}
        <div className="text-center">
          <Link
            href="/auth/login"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
} 