'use client';

import { useState } from 'react';
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

interface ProgressOverviewProps {
  overallProgress: number;
  confidenceData: { before: number; after: number };
  completedSessions: number;
  scenariosMastered: number;
  progressData: ProgressData[];
}

export default function ProgressOverview({
  overallProgress,
  confidenceData,
  completedSessions,
  scenariosMastered,
  progressData
}: ProgressOverviewProps) {
  const [selectedMetric, setSelectedMetric] = useState<'progress' | 'confidence' | 'sessions' | 'scenarios'>('progress');

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-blue-600';
    if (progress >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceImprovement = () => {
    return confidenceData.after - confidenceData.before;
  };

  const getRecentProgress = () => {
    const recentSessions = progressData
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
    
    return recentSessions.map(session => ({
      session: session.sessionNumber,
      scenario: session.scenario,
      improvement: (session.confidenceAfter || 0) - (session.confidenceBefore || 0),
      date: new Date(session.createdAt).toLocaleDateString()
    }));
  };

  return (
    <div className="space-y-6">
      {/* Overall Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Progress Circle */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Overall Progress</h3>
            <Trophy className="w-6 h-6 text-yellow-500" />
          </div>
          <div className="flex items-center justify-center">
            <div className="relative">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke={overallProgress >= 80 ? '#10b981' : overallProgress >= 60 ? '#3b82f6' : overallProgress >= 40 ? '#f59e0b' : '#ef4444'}
                  strokeWidth="8"
                  strokeDasharray={`${(overallProgress / 100) * 339.292} 339.292`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getProgressColor(overallProgress)}`}>
                    {overallProgress}%
                  </div>
                  <div className="text-sm text-gray-500">Complete</div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              {completedSessions} of 8 sessions completed
            </p>
          </div>
        </div>

        {/* Confidence Improvement */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Confidence</h3>
            <TrendingUp className="w-6 h-6 text-blue-500" />
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Before</span>
                <span className="font-medium">{confidenceData.before}/10</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gray-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(confidenceData.before / 10) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">After</span>
                <span className="font-medium">{confidenceData.after}/10</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(confidenceData.after / 10) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="text-center pt-2">
              <div className={`text-lg font-bold ${getConfidenceImprovement() > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {getConfidenceImprovement() > 0 ? '+' : ''}{getConfidenceImprovement()}
              </div>
              <div className="text-xs text-gray-500">Improvement</div>
            </div>
          </div>
        </div>

        {/* Sessions Completed */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Sessions</h3>
            <Calendar className="w-6 h-6 text-green-500" />
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {completedSessions}/8
            </div>
            <div className="text-sm text-gray-600 mb-4">
              Sessions completed
            </div>
            <div className="flex justify-center space-x-1">
              {Array.from({ length: 8 }, (_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i < completedSessions ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scenarios Mastered */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Scenarios Mastered</h3>
          <Target className="w-6 h-6 text-purple-500" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {progressData
            .filter(p => (p.confidenceAfter || 0) - (p.confidenceBefore || 0) > 2)
            .map((session, index) => (
              <div key={session.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    {session.scenario}
                  </span>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
                <div className="text-xs text-gray-600">
                  Session {session.sessionNumber}
                </div>
                <div className="mt-2 text-sm">
                  <span className="text-green-600 font-medium">
                    +{((session.confidenceAfter || 0) - (session.confidenceBefore || 0))} confidence
                  </span>
                </div>
              </div>
            ))}
          {progressData.filter(p => (p.confidenceAfter || 0) - (p.confidenceBefore || 0) > 2).length === 0 && (
            <div className="col-span-full text-center py-8">
              <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No scenarios mastered yet. Keep training!</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Progress */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Progress</h3>
          <BarChart3 className="w-6 h-6 text-blue-500" />
        </div>
        <div className="space-y-4">
          {getRecentProgress().map((progress, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">
                    {progress.session}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">{progress.scenario}</div>
                  <div className="text-sm text-gray-500">{progress.date}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-lg font-bold ${progress.improvement > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {progress.improvement > 0 ? '+' : ''}{progress.improvement}
                </div>
                <div className="text-xs text-gray-500">confidence</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 