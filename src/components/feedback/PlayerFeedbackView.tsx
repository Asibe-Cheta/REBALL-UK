'use client';

import { useState } from 'react';
import { 
  Eye, 
  Calendar, 
  Star, 
  MessageSquare,
  TrendingUp,
  Target,
  Video,
  CheckCircle,
  AlertCircle,
  Edit,
  Filter,
  Search
} from 'lucide-react';

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

interface PlayerFeedbackViewProps {
  feedbackData: FeedbackData[];
  userRole: 'player' | 'coach' | 'admin';
  onFeedbackUpdated: () => void;
}

export default function PlayerFeedbackView({ 
  feedbackData, 
  userRole, 
  onFeedbackUpdated 
}: PlayerFeedbackViewProps) {
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [filterScenario, setFilterScenario] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'session' | 'rating'>('date');

  const scenarios = Array.from(new Set(feedbackData.map(f => f.scenario)));

  const filteredFeedback = feedbackData
    .filter(feedback => {
      const matchesScenario = filterScenario === 'all' || feedback.scenario === filterScenario;
      const matchesSearch = feedback.feedback.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           feedback.scenario.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesScenario && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'session':
          return a.sessionNumber - b.sessionNumber;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  const getImprovementColor = (before: number, after: number) => {
    const improvement = after - before;
    if (improvement > 2) return 'text-green-600';
    if (improvement > 0) return 'text-blue-600';
    if (improvement < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const calculateOverallProgress = () => {
    if (!feedbackData.length) return { improvement: 0, sessions: 0, averageRating: 0 };
    
    const totalImprovement = feedbackData.reduce((sum, f) => sum + (f.confidenceAfter - f.confidenceBefore), 0);
    const averageRating = feedbackData.reduce((sum, f) => sum + f.rating, 0) / feedbackData.length;
    
    return {
      improvement: totalImprovement,
      sessions: feedbackData.length,
      averageRating: Math.round(averageRating * 10) / 10
    };
  };

  const overallProgress = calculateOverallProgress();

  return (
    <div className="space-y-6">
      {/* Progress Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Total Improvement</h3>
            <TrendingUp className="w-6 h-6 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-green-600 mb-2">
            +{overallProgress.improvement}
          </div>
          <div className="text-sm text-gray-500">Confidence points gained</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Sessions Completed</h3>
            <Calendar className="w-6 h-6 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {overallProgress.sessions}
          </div>
          <div className="text-sm text-gray-500">Feedback sessions</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Average Rating</h3>
            <Star className="w-6 h-6 text-yellow-500" />
          </div>
          <div className="text-3xl font-bold text-yellow-600 mb-2">
            {overallProgress.averageRating}
          </div>
          <div className="text-sm text-gray-500">Out of 5 stars</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search feedback..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <select
              value={filterScenario}
              onChange={(e) => setFilterScenario(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Scenarios</option>
              {scenarios.map((scenario) => (
                <option key={scenario} value={scenario}>
                  {scenario}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'session' | 'rating')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="date">Sort by Date</option>
              <option value="session">Sort by Session</option>
              <option value="rating">Sort by Rating</option>
            </select>
          </div>

          <div className="text-sm text-gray-500">
            {filteredFeedback.length} feedback session{filteredFeedback.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Feedback Cards */}
      <div className="space-y-4">
        {filteredFeedback.map((feedback) => (
          <div key={feedback.id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Session {feedback.sessionNumber} - {feedback.scenario}
                  </h3>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {feedback.scenario}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(feedback.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span>{feedback.rating}/5</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {userRole === 'coach' && (
                  <button className="text-blue-600 hover:text-blue-700">
                    <Edit className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setSelectedSession(selectedSession === feedback.id ? null : feedback.id)}
                  className="text-gray-600 hover:text-gray-700"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Confidence Ratings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Before</div>
                <div className="text-2xl font-bold text-gray-900">{feedback.confidenceBefore}/10</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">After</div>
                <div className="text-2xl font-bold text-blue-600">{feedback.confidenceAfter}/10</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Improvement</div>
                <div className={`text-2xl font-bold ${getImprovementColor(feedback.confidenceBefore, feedback.confidenceAfter)}`}>
                  {feedback.confidenceAfter - feedback.confidenceBefore > 0 ? '+' : ''}
                  {feedback.confidenceAfter - feedback.confidenceBefore}
                </div>
              </div>
            </div>

            {/* Rating Stars */}
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-sm text-gray-600">Session Rating:</span>
              <div className="flex space-x-1">
                {getRatingStars(feedback.rating)}
              </div>
            </div>

            {/* Feedback Preview */}
            <div className="mb-4">
              <div className="flex items-start space-x-3">
                <MessageSquare className="w-5 h-5 text-blue-500 mt-0.5" />
                <p className="text-gray-700 line-clamp-3">
                  {feedback.feedback}
                </p>
              </div>
            </div>

            {/* Expanded Details */}
            {selectedSession === feedback.id && (
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                {/* Full Feedback */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Session Feedback</h4>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                    {feedback.feedback}
                  </p>
                </div>

                {/* Strengths */}
                {feedback.strengths.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Strengths</h4>
                    <div className="space-y-2">
                      {feedback.strengths.map((strength, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-gray-700">{strength}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Items */}
                {feedback.actionItems.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Action Items</h4>
                    <div className="space-y-2">
                      {feedback.actionItems.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <AlertCircle className="w-4 h-4 text-yellow-500" />
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Video Links */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Session Resources</h4>
                  <div className="flex space-x-2">
                    <button className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm">
                      <Video className="w-4 h-4" />
                      <span>Watch Session Video</span>
                    </button>
                    <button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">
                      <Target className="w-4 h-4" />
                      <span>Practice Drills</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredFeedback.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback found</h3>
            <p className="text-gray-500">
              {searchTerm || filterScenario !== 'all' 
                ? 'Try adjusting your search or filters.'
                : 'No feedback sessions have been completed yet.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 