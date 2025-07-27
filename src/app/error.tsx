'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to the console
    console.error('Global error caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Something went wrong
        </h1>

        <p className="text-gray-600 mb-8">
          We encountered an unexpected error. Our team has been notified and we're working to fix it as soon as possible.
        </p>

        {process.env.NODE_ENV === 'development' && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              Error Details (Development)
            </summary>
            <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono text-gray-700 overflow-auto">
              <div className="mb-2">
                <strong>Error:</strong> {error.message}
              </div>
              {error.digest && (
                <div className="mb-2">
                  <strong>Digest:</strong> {error.digest}
                </div>
              )}
              <div>
                <strong>Stack:</strong>
                <pre className="mt-1 whitespace-pre-wrap text-xs">
                  {error.stack}
                </pre>
              </div>
            </div>
          </details>
        )}

        <div className="space-y-4 mb-8">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center w-full px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center w-full px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <Home className="w-5 h-5 mr-2" />
            Go to Homepage
          </Link>
        </div>

        <div className="border-t pt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">What you can do:</h3>
          <ul className="text-sm text-gray-600 space-y-2 text-left">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Refresh the page and try again</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Check your internet connection</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Clear your browser cache and cookies</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Contact support if the problem persists</span>
            </li>
          </ul>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Need immediate help? Contact our support team:</p>
          <div className="mt-2 space-y-1">
            <a href="mailto:support@reball.uk" className="text-blue-600 hover:text-blue-700 block">
              support@reball.uk
            </a>
            <a href="tel:+441234567890" className="text-blue-600 hover:text-blue-700 block">
              +44 123 456 7890
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 