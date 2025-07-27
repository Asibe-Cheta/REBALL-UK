'use client';

import { useState } from 'react';
import { 
  Calendar, 
  Play, 
  CheckCircle, 
  Clock, 
  Star,
  Video,
  MessageSquare,
  ArrowRight,
  CalendarDays,
  Target,
  TrendingUp
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

interface SessionTimelineProps {
  progressData: ProgressData[];
}

interface SessionCard {
  sessionNumber: number;
  status: 'completed' | 'scheduled' | 'available';
  date?: Date;
  scenario?: string;
  confidenceBefore?: number;
  confidenceAfter?: number;
  feedback?: string;
  improvement?: number;
  hasVideo?: boolean;
}

export default function SessionTimeline({ progressData }: SessionTimelineProps) {
  const [selectedSession, setSelectedSession] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'scheduled' | 'available'>('all');

  const generateSessionCards = (): SessionCard[] => {
    const sessions: SessionCard[] = [];
    
    for (let i = 1; i <= 8; i++) {
      const sessionData = progressData.find(p => p.sessionNumber === i);
      
      if (sessionData) {
        sessions.push({
          sessionNumber: i,
          status: 'completed',
          date: new Date(sessionData.createdAt),
          scenario: sessionData.scenario,
          confidenceBefore: sessionData.confidenceBefore || 0,
          confidenceAfter: sessionData.confidenceAfter || 0,
          feedback: sessionData.feedback,
          improvement: (sessionData.confidenceAfter || 0) - (sessionData.confidenceBefore || 0),
          hasVideo: true // Assuming videos are available for completed sessions
        });
      } else {
        // Check if session is scheduled (future date)
        const today = new Date();
        const sessionDate = new Date();
        sessionDate.setDate(today.getDate() + (i - 1) * 7); // Weekly sessions
        
        sessions.push({
          sessionNumber: i,
          status: sessionDate > today ? 'scheduled' : 'available',
          date: sessionDate,
          hasVideo: false
        });
      }
    }
    
    return sessions;
  };

  const sessionCards = generateSessionCards();
  const filteredSessions = filterStatus === 'all' 
    ? sessionCards 
    : sessionCards.filter(s => s.status === filterStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'scheduled': return 'bg-blue-500';
      case 'available': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-white" />;
      case 'scheduled': return <Clock className="w-5 h-5 text-white" />;
      case 'available': return <Calendar className="w-5 h-5 text-white" />;
      default: return <Calendar className="w-5 h-5 text-white" />;
    }
  };

  const getImprovementColor = (improvement: number) => {
    if (improvement > 2) return 'text-green-600';
    if (improvement > 0) return 'text-blue-600';
    if (improvement < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Session Timeline</h3>
          <CalendarDays className="w-6 h-6 text-blue-500" />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Sessions
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'completed'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilterStatus('scheduled')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'scheduled'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Scheduled
          </button>
          <button
            onClick={() => setFilterStatus('available')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'available'
                ? 'bg-gray-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Available
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          
          <div className="space-y-6">
            {filteredSessions.map((session, index) => (
              <div key={session.sessionNumber} className="relative">
                {/* Timeline Dot */}
                <div className={`absolute left-6 w-4 h-4 rounded-full ${getStatusColor(session.status)} flex items-center justify-center transform -translate-x-1/2`}>
                  {getStatusIcon(session.status)}
                </div>
                
                {/* Session Card */}
                <div className={`ml-16 bg-gray-50 rounded-lg p-6 transition-all duration-200 ${
                  selectedSession === session.sessionNumber ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-100'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h4 className="text-lg font-semibold text-gray-900">
                          Session {session.sessionNumber}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          session.status === 'completed' ? 'bg-green-100 text-green-800' :
                          session.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                        </span>
                      </div>
                      
                      {session.date && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                          <Calendar className="w-4 h-4" />
                          <span>{session.date.toLocaleDateString()}</span>
                        </div>
                      )}
                      
                      {session.scenario && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                          <Target className="w-4 h-4" />
                          <span>{session.scenario}</span>
                        </div>
                      )}
                      
                      {session.status === 'completed' && session.confidenceBefore !== undefined && session.confidenceAfter !== undefined && (
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Confidence Before:</span>
                            <span className="font-medium">{session.confidenceBefore}/10</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Confidence After:</span>
                            <span className="font-medium">{session.confidenceAfter}/10</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Improvement:</span>
                            <span className={`font-medium ${getImprovementColor(session.improvement || 0)}`}>
                              {session.improvement && session.improvement > 0 ? '+' : ''}{session.improvement}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {session.feedback && (
                        <div className="mb-4">
                          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                            <MessageSquare className="w-4 h-4" />
                            <span>Coach Feedback</span>
                          </div>
                          <p className="text-sm text-gray-700 bg-white p-3 rounded border">
                            {session.feedback}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      {session.hasVideo && (
                        <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm">
                          <Video className="w-4 h-4" />
                          <span>Watch Video</span>
                        </button>
                      )}
                      
                      {session.status === 'completed' && (
                        <button 
                          onClick={() => setSelectedSession(selectedSession === session.sessionNumber ? null : session.sessionNumber)}
                          className="flex items-center space-x-2 text-gray-600 hover:text-gray-700 text-sm"
                        >
                          <span>{selectedSession === session.sessionNumber ? 'Hide' : 'View'} Details</span>
                          <ArrowRight className={`w-4 h-4 transition-transform ${selectedSession === session.sessionNumber ? 'rotate-90' : ''}`} />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Expanded Details */}
                  {selectedSession === session.sessionNumber && session.status === 'completed' && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded border">
                          <h5 className="font-medium text-gray-900 mb-2">Session Summary</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Scenario:</span>
                              <span className="font-medium">{session.scenario}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Date:</span>
                              <span className="font-medium">{session.date?.toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Duration:</span>
                              <span className="font-medium">60 minutes</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white p-4 rounded border">
                          <h5 className="font-medium text-gray-900 mb-2">Performance</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Confidence Gain:</span>
                              <span className={`font-medium ${getImprovementColor(session.improvement || 0)}`}>
                                {session.improvement && session.improvement > 0 ? '+' : ''}{session.improvement}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Video Views:</span>
                              <span className="font-medium">3</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Practice Time:</span>
                              <span className="font-medium">45 min</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Session Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Completed</h4>
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-green-600">
            {sessionCards.filter(s => s.status === 'completed').length}
          </div>
          <div className="text-sm text-gray-500">of 8 sessions</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Scheduled</h4>
            <Clock className="w-6 h-6 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-blue-600">
            {sessionCards.filter(s => s.status === 'scheduled').length}
          </div>
          <div className="text-sm text-gray-500">upcoming sessions</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Available</h4>
            <Calendar className="w-6 h-6 text-gray-500" />
          </div>
          <div className="text-3xl font-bold text-gray-600">
            {sessionCards.filter(s => s.status === 'available').length}
          </div>
          <div className="text-sm text-gray-500">ready to book</div>
        </div>
      </div>
    </div>
  );
} 