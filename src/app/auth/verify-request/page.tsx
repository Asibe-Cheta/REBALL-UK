"use client";

import { Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function VerifyRequestPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-6xl text-white mb-4">REBALL</h1>
          <div className="flex justify-center mb-6">
            <div className="bg-white p-4 rounded-full">
              <Mail className="w-8 h-8 text-black" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Check your email</h2>
          <p className="text-white-text">We've sent you a verification link</p>
        </div>

        <div className="bg-black-dark rounded-lg p-8 border border-black-accent">
          <div className="text-center space-y-4">
            <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-4">
              <h3 className="text-green-400 font-semibold mb-2">Verification Email Sent</h3>
              <p className="text-white-text text-sm">
                We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
              </p>
            </div>

            <div className="bg-blue-900/20 border border-blue-500/50 rounded-lg p-4">
              <h4 className="text-blue-400 font-semibold mb-2">What's Next?</h4>
              <ul className="text-white-text text-sm space-y-1 text-left">
                <li>• Check your email inbox (and spam folder)</li>
                <li>• Click the verification link in the email</li>
                <li>• Complete your REBALL profile</li>
                <li>• Start your football training journey!</li>
              </ul>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-4">
              <h4 className="text-yellow-400 font-semibold mb-2">Didn't receive the email?</h4>
              <p className="text-white-text text-sm">
                Check your spam folder or try signing up again. The verification link expires in 10 minutes.
              </p>
            </div>

            <div className="pt-4">
              <Link
                href="/auth/signin"
                className="inline-flex items-center text-white hover:text-white-off transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 