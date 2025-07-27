import Link from 'next/link';
import { Home, ArrowLeft, Search, BookOpen, User } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-200">404</h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <Home className="w-5 h-5 mr-2" />
            Go to Homepage
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center w-full px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>
        </div>

        <div className="border-t pt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Pages</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/courses"
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <BookOpen className="w-5 h-5 text-blue-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">Training Courses</span>
            </Link>

            <Link
              href="/about"
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <User className="w-5 h-5 text-blue-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">About REBALL</span>
            </Link>

            <Link
              href="/pricing"
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <Search className="w-5 h-5 text-blue-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">Pricing</span>
            </Link>

            <Link
              href="/contact"
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <User className="w-5 h-5 text-blue-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">Contact Us</span>
            </Link>
          </div>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Need help? Contact our support team at</p>
          <a href="mailto:support@reball.uk" className="text-blue-600 hover:text-blue-700">
            support@reball.uk
          </a>
        </div>
      </div>
    </div>
  );
} 