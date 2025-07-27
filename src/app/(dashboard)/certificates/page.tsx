'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  Award, 
  Download, 
  Share2, 
  Eye, 
  Plus,
  CheckCircle,
  Star,
  Calendar,
  Target,
  TrendingUp,
  FileText,
  QrCode
} from 'lucide-react';
import CertificateGallery from '@/components/certificates/CertificateGallery';
import CertificateGenerator from '@/components/certificates/CertificateGenerator';
import CertificateAnalytics from '@/components/certificates/CertificateAnalytics';
import CertificateVerification from '@/components/certificates/CertificateVerification';

interface Certificate {
  id: string;
  playerId: string;
  courseId: string;
  certificateUrl: string;
  certificateId: string;
  playerName: string;
  courseName: string;
  completionDate: Date;
  improvementPercentage: number;
  totalSessionsCompleted: number;
  position: string;
  coachName: string;
  issuedDate: Date;
  status: 'pending' | 'issued' | 'expired';
}

interface Course {
  id: string;
  name: string;
  description: string;
  durationWeeks: number;
}

export default function CertificatesPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<'gallery' | 'generate' | 'analytics' | 'verification'>('gallery');
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<'player' | 'coach' | 'admin'>('player');

  useEffect(() => {
    if (session?.user) {
      fetchCertificates();
      fetchCourses();
      determineUserRole();
    }
  }, [session]);

  const fetchCertificates = async () => {
    try {
      const response = await fetch('/api/certificates');
      if (response.ok) {
        const data = await response.json();
        setCertificates(data.certificates);
      }
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const determineUserRole = () => {
    if (session?.user?.email?.includes('coach')) {
      setUserRole('coach');
    } else if (session?.user?.email?.includes('admin')) {
      setUserRole('admin');
    } else {
      setUserRole('player');
    }
  };

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">Please sign in to view certificates.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const canGenerateCertificates = userRole === 'coach' || userRole === 'admin';
  const canViewAnalytics = userRole === 'coach' || userRole === 'admin';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Certificates</h1>
              <p className="text-gray-600 mt-1">
                Track your achievements and download completion certificates
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-medium text-gray-900 capitalize">
                  {userRole}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('gallery')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'gallery'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Award className="w-4 h-4 inline mr-2" />
              Certificate Gallery
            </button>
            {canGenerateCertificates && (
              <button
                onClick={() => setActiveTab('generate')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'generate'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Plus className="w-4 h-4 inline mr-2" />
                Generate Certificate
              </button>
            )}
            {canViewAnalytics && (
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'analytics'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <TrendingUp className="w-4 h-4 inline mr-2" />
                Analytics
              </button>
            )}
            <button
              onClick={() => setActiveTab('verification')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'verification'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <QrCode className="w-4 h-4 inline mr-2" />
              Verify Certificate
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'gallery' && (
          <CertificateGallery 
            certificates={certificates}
            userRole={userRole}
            onCertificateUpdated={fetchCertificates}
          />
        )}
        
        {activeTab === 'generate' && canGenerateCertificates && (
          <CertificateGenerator 
            courses={courses}
            onCertificateGenerated={fetchCertificates}
          />
        )}
        
        {activeTab === 'analytics' && canViewAnalytics && (
          <CertificateAnalytics 
            certificates={certificates}
            courses={courses}
          />
        )}
        
        {activeTab === 'verification' && (
          <CertificateVerification />
        )}
      </div>
    </div>
  );
} 