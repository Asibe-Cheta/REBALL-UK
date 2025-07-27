'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Award, 
  Play, 
  CheckCircle, 
  Clock, 
  Star,
  BarChart3,
  Users,
  Trophy,
  ArrowUpRight
} from 'lucide-react';
import ProgressOverview from '@/components/progress/ProgressOverview';
import ConfidenceTracking from '@/components/progress/ConfidenceTracking';
import SessionTimeline from '@/components/progress/SessionTimeline';
import ScenarioMastery from '@/components/progress/ScenarioMastery';
import CoachFeedback from '@/components/progress/CoachFeedback';

interface ProgressData {
  id: string;
  userId: string;
  courseId: string;
  scenario: string;
  confidenceBefore: number;
  confidenceAfter: number;
  sessionNumber: number;
  feedback: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CourseData {
  id: string;
  name: string;
  durationWeeks: number;
  description: string;
}

export default function ProgressPage() {
  const { data: session } = useSession();
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'confidence' | 'sessions' | 'scenarios' | 'feedback'>('overview');

  useEffect(() => {
    if (session?.user) {
      fetchProgressData();
    }
  }, [session]);

  const fetchProgressData = async () => {
    try {
      const response = await fetch('/api/progress');
      if (response.ok) {
        const data = await response.json();
        setProgressData(data.progress);
        setCourseData(data.course);
      }
    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">Please sign in to view your progress.</p>
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

  const calculateOverallProgress = () => {
    if (!progressData.length) return 0;
    const completedSessions = new Set(progressData.map(p => p.sessionNumber)).size;
    return Math.round((completedSessions / 8) * 100);
  };

  const calculateAverageConfidence = () => {
    if (!progressData.length) return { before: 0, after: 0 };
    const before = progressData.reduce((sum, p) => sum + (p.confidenceBefore || 0), 0) / progressData.length;
    const after = progressData.reduce((sum, p) => sum + (p.confidenceAfter || 0), 0) / progressData.length;
    return { before: Math.round(before), after: Math.round(after) };
  };

  const getCompletedSessions = () => {
    return new Set(progressData.map(p => p.sessionNumber)).size;
  };

  const getScenariosMastered = () => {
    return progressData.filter(p => (p.confidenceAfter || 0) - (p.confidenceBefore || 0) > 2).length;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Progress Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Track your development across REBALL training sessions
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Course</p>
                <p className="font-medium text-gray-900">
                  {courseData?.name || 'Loading...'}
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
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('confidence')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'confidence'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              Confidence
            </button>
            <button
              onClick={() => setActiveTab('sessions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'sessions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Sessions
            </button>
            <button
              onClick={() => setActiveTab('scenarios')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'scenarios'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Target className="w-4 h-4 inline mr-2" />
              Scenarios
            </button>
            <button
              onClick={() => setActiveTab('feedback')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'feedback'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Coach Feedback
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <ProgressOverview
            overallProgress={calculateOverallProgress()}
            confidenceData={calculateAverageConfidence()}
            completedSessions={getCompletedSessions()}
            scenariosMastered={getScenariosMastered()}
            progressData={progressData}
          />
        )}
        
        {activeTab === 'confidence' && (
          <ConfidenceTracking progressData={progressData} />
        )}
        
        {activeTab === 'sessions' && (
          <SessionTimeline progressData={progressData} />
        )}
        
        {activeTab === 'scenarios' && (
          <ScenarioMastery progressData={progressData} />
        )}
        
        {activeTab === 'feedback' && (
          <CoachFeedback progressData={progressData} />
        )}
      </div>
    </div>
  );
} 