'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  MessageSquare, 
  TrendingUp, 
  Users, 
  Target, 
  Star,
  Plus,
  Edit,
  Eye,
  BarChart3,
  Calendar,
  Award,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import CoachFeedbackForm from '@/components/feedback/CoachFeedbackForm';
import PlayerFeedbackView from '@/components/feedback/PlayerFeedbackView';
import FeedbackAnalytics from '@/components/feedback/FeedbackAnalytics';
import ConfidenceRatingSystem from '@/components/feedback/ConfidenceRatingSystem';

interface FeedbackData {
  id: string;
  sessionNumber: number;
  playerId: string;
  coachId: string;
  confidenceBefore: number;
  confidenceAfter: number;
  scenario: string;
  feedback: string;
  strengths: string[];
  actionItems: string[];
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'player' | 'coach' | 'admin';
}

export default function FeedbackPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<'form' | 'view' | 'analytics' | 'ratings'>('form');
  const [feedbackData, setFeedbackData] = useState<FeedbackData[]>([]);
  const [players, setPlayers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<'player' | 'coach' | 'admin'>('player');

  useEffect(() => {
    if (session?.user) {
      fetchFeedbackData();
      fetchPlayers();
      determineUserRole();
    }
  }, [session]);

  const fetchFeedbackData = async () => {
    try {
      const response = await fetch('/api/feedback');
      if (response.ok) {
        const data = await response.json();
        setFeedbackData(data.feedback);
      }
    } catch (error) {
      console.error('Error fetching feedback data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlayers = async () => {
    try {
      const response = await fetch('/api/users?role=player');
      if (response.ok) {
        const data = await response.json();
        setPlayers(data.users);
      }
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  const determineUserRole = () => {
    // This would be determined from the user's profile or session
    // For now, we'll set it based on the user's email or other criteria
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
          <p className="text-gray-600">Please sign in to view feedback.</p>
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

  const canCreateFeedback = userRole === 'coach' || userRole === 'admin';
  const canViewAnalytics = userRole === 'coach' || userRole === 'admin';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Feedback System</h1>
              <p className="text-gray-600 mt-1">
                Track player development and provide coaching feedback
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
            {canCreateFeedback && (
              <button
                onClick={() => setActiveTab('form')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'form'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Plus className="w-4 h-4 inline mr-2" />
                Create Feedback
              </button>
            )}
            <button
              onClick={() => setActiveTab('view')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'view'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Eye className="w-4 h-4 inline mr-2" />
              View Feedback
            </button>
            <button
              onClick={() => setActiveTab('ratings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'ratings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Star className="w-4 h-4 inline mr-2" />
              Confidence Ratings
            </button>
            {canViewAnalytics && (
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'analytics'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BarChart3 className="w-4 h-4 inline mr-2" />
                Analytics
              </button>
            )}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'form' && canCreateFeedback && (
          <CoachFeedbackForm 
            players={players}
            onFeedbackCreated={fetchFeedbackData}
          />
        )}
        
        {activeTab === 'view' && (
          <PlayerFeedbackView 
            feedbackData={feedbackData}
            userRole={userRole}
            onFeedbackUpdated={fetchFeedbackData}
          />
        )}
        
        {activeTab === 'ratings' && (
          <ConfidenceRatingSystem 
            feedbackData={feedbackData}
            userRole={userRole}
          />
        )}
        
        {activeTab === 'analytics' && canViewAnalytics && (
          <FeedbackAnalytics 
            feedbackData={feedbackData}
            players={players}
          />
        )}
      </div>
    </div>
  );
} 