'use client';

import { useState } from 'react';
import {
  Users,
  MessageSquare,
  CheckCircle,
  Clock,
  Star,
  Target,
  TrendingUp,
  Award,
  Lightbulb,
  AlertCircle,
  ThumbsUp,
  ArrowRight,
  Calendar,
  BookOpen,
  Video
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

interface CoachFeedbackProps {
  progressData: ProgressData[];
}

interface FeedbackItem {
  sessionNumber: number;
  scenario: string;
  date: Date;
  feedback: string;
  strengths: string[];
  areasForImprovement: string[];
  actionItems: string[];
  coachName: string;
  rating: number;
}

interface DevelopmentPlan {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  timeline: string;
  resources: string[];
}

export default function CoachFeedback({ progressData }: CoachFeedbackProps) {
  const [selectedSession, setSelectedSession] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'strengths' | 'improvements' | 'actions'>('all');

  // Generate mock feedback data based on progress data
  const generateFeedbackData = (): FeedbackItem[] => {
    return progressData.map(session => ({
      sessionNumber: session.sessionNumber,
      scenario: session.scenario,
      date: new Date(session.createdAt),
      feedback: session.feedback || `Great work on ${session.scenario}! Your confidence improved from ${session.confidenceBefore} to ${session.confidenceAfter}. Keep practicing the techniques we covered.`,
      strengths: [
        'Excellent ball control',
        'Good positioning',
        'Strong work ethic',
        'Quick decision making'
      ],
      areasForImprovement: [
        'Need more practice with finishing',
        'Work on crossing accuracy',
        'Improve defensive positioning'
      ],
      actionItems: [
        'Practice finishing drills 3x per week',
        'Watch crossing technique videos',
        'Focus on defensive drills in next session'
      ],
      coachName: 'Coach Josh',
      rating: Math.min(5, Math.max(1, Math.floor((session.confidenceAfter || 0) / 2)))
    }));
  };

  const feedbackData = generateFeedbackData();

  const developmentPlans: DevelopmentPlan[] = [
    {
      title: 'Advanced Finishing Course',
      description: 'Take your finishing skills to the next level with advanced techniques and game scenarios.',
      priority: 'high',
      timeline: 'Next 4 weeks',
      resources: ['Video library', 'Practice drills', 'Game analysis']
    },
    {
      title: 'Crossing Mastery',
      description: 'Improve your crossing accuracy and delivery under pressure.',
      priority: 'medium',
      timeline: 'Next 6 weeks',
      resources: ['Technique videos', 'Accuracy drills', 'Match practice']
    },
    {
      title: 'Defensive Positioning',
      description: 'Master defensive positioning and tackling techniques.',
      priority: 'medium',
      timeline: 'Next 8 weeks',
      resources: ['Positioning guides', 'Tackling practice', 'Game scenarios']
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const getOverallStrengths = () => {
    const allStrengths = feedbackData.flatMap(f => f.strengths);
    const strengthCounts = allStrengths.reduce((acc, strength) => {
      acc[strength] = (acc[strength] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(strengthCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([strength, count]) => ({ strength, count }));
  };

  const getOverallImprovements = () => {
    const allImprovements = feedbackData.flatMap(f => f.areasForImprovement);
    const improvementCounts = allImprovements.reduce((acc, improvement) => {
      acc[improvement] = (acc[improvement] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(improvementCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([improvement, count]) => ({ improvement, count }));
  };

  const filteredFeedback = filterType === 'all'
    ? feedbackData
    : feedbackData.filter(f => {
      if (filterType === 'strengths') return f.strengths.length > 0;
      if (filterType === 'improvements') return f.areasForImprovement.length > 0;
      if (filterType === 'actions') return f.actionItems.length > 0;
      return true;
    });

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Coach Feedback</h3>
          <Users className="w-6 h-6 text-blue-500" />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterType === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            All Feedback
          </button>
          <button
            onClick={() => setFilterType('strengths')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterType === 'strengths'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            Strengths
          </button>
          <button
            onClick={() => setFilterType('improvements')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterType === 'improvements'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            Areas to Improve
          </button>
          <button
            onClick={() => setFilterType('actions')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterType === 'actions'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            Action Items
          </button>
        </div>
      </div>

      {/* Session Feedback */}
      <div className="space-y-4">
        {filteredFeedback.map((feedback) => (
          <div key={feedback.sessionNumber} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">
                  Session {feedback.sessionNumber} - {feedback.scenario}
                </h4>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                  <span>{feedback.date.toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{feedback.coachName}</span>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    {getRatingStars(feedback.rating)}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedSession(selectedSession === feedback.sessionNumber ? null : feedback.sessionNumber)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                {selectedSession === feedback.sessionNumber ? 'Hide Details' : 'View Details'}
              </button>
            </div>

            <div className="mb-4">
              <div className="flex items-start space-x-3">
                <MessageSquare className="w-5 h-5 text-blue-500 mt-0.5" />
                <p className="text-gray-700">{feedback.feedback}</p>
              </div>
            </div>

            {/* Expanded Details */}
            {selectedSession === feedback.sessionNumber && (
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                {/* Strengths */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <ThumbsUp className="w-5 h-5 text-green-500" />
                    <h5 className="font-medium text-gray-900">Strengths</h5>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {feedback.strengths.map((strength, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-gray-700">{strength}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Areas for Improvement */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                    <h5 className="font-medium text-gray-900">Areas for Improvement</h5>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {feedback.areasForImprovement.map((improvement, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <Target className="w-4 h-4 text-yellow-500" />
                        <span className="text-gray-700">{improvement}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Items */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Lightbulb className="w-5 h-5 text-purple-500" />
                    <h5 className="font-medium text-gray-900">Action Items</h5>
                  </div>
                  <div className="space-y-2">
                    {feedback.actionItems.map((action, index) => (
                      <div key={index} className="flex items-start space-x-2 text-sm">
                        <ArrowRight className="w-4 h-4 text-purple-500 mt-0.5" />
                        <span className="text-gray-700">{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Overall Strengths & Improvements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overall Strengths */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Overall Strengths</h4>
            <ThumbsUp className="w-6 h-6 text-green-500" />
          </div>
          <div className="space-y-3">
            {getOverallStrengths().map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-gray-900">{item.strength}</span>
                </div>
                <span className="text-xs text-gray-500">{item.count} mentions</span>
              </div>
            ))}
          </div>
        </div>

        {/* Areas for Improvement */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Areas for Improvement</h4>
            <AlertCircle className="w-6 h-6 text-yellow-500" />
          </div>
          <div className="space-y-3">
            {getOverallImprovements().map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-900">{item.improvement}</span>
                </div>
                <span className="text-xs text-gray-500">{item.count} mentions</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Development Plans */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-semibold text-gray-900">Development Plans</h4>
          <BookOpen className="w-6 h-6 text-blue-500" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {developmentPlans.map((plan, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <h5 className="font-medium text-gray-900">{plan.title}</h5>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(plan.priority)}`}>
                  {plan.priority}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{plan.description}</p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  <span>{plan.timeline}</span>
                </div>
                <div className="text-xs text-gray-500">
                  {plan.resources.length} resources available
                </div>
              </div>
              <button className="w-full bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                View Plan
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900">Next Steps</h4>
          <TrendingUp className="w-6 h-6 text-green-500" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <h5 className="font-medium text-gray-900 mb-2">Schedule Next Session</h5>
            <p className="text-sm text-gray-600">Book your next training session to continue your progress</p>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Video className="w-6 h-6 text-green-600" />
            </div>
            <h5 className="font-medium text-gray-900 mb-2">Watch Session Videos</h5>
            <p className="text-sm text-gray-600">Review your training videos to reinforce techniques</p>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <h5 className="font-medium text-gray-900 mb-2">Practice Drills</h5>
            <p className="text-sm text-gray-600">Complete recommended practice drills between sessions</p>
          </div>
        </div>
      </div>
    </div>
  );
} 