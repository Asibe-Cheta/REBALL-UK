'use client';

import { useState } from 'react';
import { 
  Star, 
  TrendingUp, 
  BarChart3, 
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Plus,
  Eye,
  Calendar
} from 'lucide-react';
import ProgressChart from '../progress/ProgressChart';

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

interface ConfidenceRatingSystemProps {
  feedbackData: FeedbackData[];
  userRole: 'player' | 'coach' | 'admin';
}

export default function ConfidenceRatingSystem({ 
  feedbackData, 
  userRole 
}: ConfidenceRatingSystemProps) {
  const [selectedScenario, setSelectedScenario] = useState<string>('all');
  const [showHistoricalComparison, setShowHistoricalComparison] = useState(false);
  const [newRating, setNewRating] = useState({
    sessionNumber: 1,
    scenario: 'Finishing',
    confidenceBefore: 5,
    confidenceAfter: 7
  });

  const scenarios = Array.from(new Set(feedbackData.map(f => f.scenario)));

  const getScenarioData = (scenario: string) => {
    if (scenario === 'all') {
      return feedbackData;
    }
    return feedbackData.filter(f => f.scenario === scenario);
  };

  const calculateAverageConfidence = (data: FeedbackData[]) => {
    if (!data.length) return { before: 0, after: 0 };
    const before = data.reduce((sum, f) => sum + f.confidenceBefore, 0) / data.length;
    const after = data.reduce((sum, f) => sum + f.confidenceAfter, 0) / data.length;
    return { before: Math.round(before * 10) / 10, after: Math.round(after * 10) / 10 };
  };

  const getConfidenceTrend = (data: FeedbackData[]) => {
    return data
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .map((session, index) => ({
        session: session.sessionNumber,
        before: session.confidenceBefore,
        after: session.confidenceAfter,
        improvement: session.confidenceAfter - session.confidenceBefore,
        date: new Date(session.createdAt).toLocaleDateString(),
        scenario: session.scenario
      }));
  };

  const getImprovementPercentage = (data: FeedbackData[]) => {
    if (!data.length) return 0;
    const totalImprovement = data.reduce((sum, f) => {
      return sum + (f.confidenceAfter - f.confidenceBefore);
    }, 0);
    return Math.round((totalImprovement / data.length) * 10) / 10;
  };

  const getBestSession = (data: FeedbackData[]) => {
    if (!data.length) return null;
    return data.reduce((best, current) => {
      const currentImprovement = current.confidenceAfter - current.confidenceBefore;
      const bestImprovement = best.confidenceAfter - best.confidenceBefore;
      return currentImprovement > bestImprovement ? current : best;
    });
  };

  const getWorstSession = (data: FeedbackData[]) => {
    if (!data.length) return null;
    return data.reduce((worst, current) => {
      const currentImprovement = current.confidenceAfter - current.confidenceBefore;
      const worstImprovement = worst.confidenceAfter - worst.confidenceBefore;
      return currentImprovement < worstImprovement ? current : worst;
    });
  };

  const currentData = getScenarioData(selectedScenario);
  const averageConfidence = calculateAverageConfidence(currentData);
  const confidenceTrend = getConfidenceTrend(currentData);
  const improvementPercentage = getImprovementPercentage(currentData);
  const bestSession = getBestSession(currentData);
  const worstSession = getWorstSession(currentData);

  const handleNewRatingChange = (field: string, value: number) => {
    setNewRating(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getImprovementColor = (improvement: number) => {
    if (improvement > 2) return 'text-green-600';
    if (improvement > 0) return 'text-blue-600';
    if (improvement < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Scenario Filter */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Confidence Rating System</h3>
          <Star className="w-6 h-6 text-yellow-500" />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedScenario('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedScenario === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Scenarios
          </button>
          {scenarios.map((scenario) => (
            <button
              key={scenario}
              onClick={() => setSelectedScenario(scenario)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedScenario === scenario
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {scenario}
            </button>
          ))}
        </div>
      </div>

      {/* New Rating Input (for coaches) */}
      {userRole === 'coach' && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Add New Rating</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Number
              </label>
              <select
                value={newRating.sessionNumber}
                onChange={(e) => handleNewRatingChange('sessionNumber', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {Array.from({ length: 8 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Session {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scenario
              </label>
              <select
                value={newRating.scenario}
                onChange={(e) => handleNewRatingChange('scenario', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {scenarios.map((scenario) => (
                  <option key={scenario} value={scenario}>
                    {scenario}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Before Confidence
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={newRating.confidenceBefore}
                  onChange={(e) => handleNewRatingChange('confidenceBefore', parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-lg font-bold text-gray-900 w-8 text-center">
                  {newRating.confidenceBefore}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                After Confidence
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={newRating.confidenceAfter}
                  onChange={(e) => handleNewRatingChange('confidenceAfter', parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-lg font-bold text-gray-900 w-8 text-center">
                  {newRating.confidenceAfter}
                </span>
              </div>
            </div>
          </div>

          {/* Improvement Display */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Improvement:</span>
              <span className={`text-lg font-bold ${getImprovementColor(newRating.confidenceAfter - newRating.confidenceBefore)}`}>
                {newRating.confidenceAfter - newRating.confidenceBefore > 0 ? '+' : ''}
                {newRating.confidenceAfter - newRating.confidenceBefore}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Confidence Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Average Confidence */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Average Confidence</h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Before Training</span>
                <span className="font-medium">{averageConfidence.before}/10</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gray-400 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(averageConfidence.before / 10) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">After Training</span>
                <span className="font-medium">{averageConfidence.after}/10</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(averageConfidence.after / 10) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="text-center pt-2">
              <div className={`text-2xl font-bold ${improvementPercentage > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {improvementPercentage > 0 ? '+' : ''}{improvementPercentage}
              </div>
              <div className="text-sm text-gray-500">Average Improvement</div>
            </div>
          </div>
        </div>

        {/* Best Session */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Best Session</h4>
          {bestSession ? (
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  +{bestSession.confidenceAfter - bestSession.confidenceBefore}
                </div>
                <div className="text-sm text-gray-600">Improvement</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-gray-900">{bestSession.scenario}</div>
                <div className="text-sm text-gray-500">Session {bestSession.sessionNumber}</div>
              </div>
              <div className="text-center text-xs text-gray-500">
                {new Date(bestSession.createdAt).toLocaleDateString()}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <ArrowUpRight className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No sessions completed yet</p>
            </div>
          )}
        </div>

        {/* Worst Session */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Needs Improvement</h4>
          {worstSession ? (
            <div className="space-y-3">
              <div className="text-center">
                <div className={`text-3xl font-bold ${(worstSession.confidenceAfter - worstSession.confidenceBefore) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {(worstSession.confidenceAfter - worstSession.confidenceBefore) > 0 ? '+' : ''}{(worstSession.confidenceAfter - worstSession.confidenceBefore)}
                </div>
                <div className="text-sm text-gray-600">Improvement</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-gray-900">{worstSession.scenario}</div>
                <div className="text-sm text-gray-500">Session {worstSession.sessionNumber}</div>
              </div>
              <div className="text-center text-xs text-gray-500">
                {new Date(worstSession.createdAt).toLocaleDateString()}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <ArrowDownRight className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No sessions completed yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Confidence Trend Chart */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-semibold text-gray-900">Confidence Trend</h4>
          <button
            onClick={() => setShowHistoricalComparison(!showHistoricalComparison)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {showHistoricalComparison ? 'Hide' : 'Show'} Historical Comparison
          </button>
        </div>
        
        {confidenceTrend.length > 0 ? (
          <div className="mb-6">
            <ProgressChart
              data={confidenceTrend}
              type="line"
              xKey="session"
              yKey="after"
              title="Confidence Over Time"
              color="#3b82f6"
              height={300}
            />
          </div>
        ) : (
          <div className="text-center py-8">
            <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No confidence data available yet</p>
          </div>
        )}

        {/* Historical Comparison */}
        {showHistoricalComparison && confidenceTrend.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h5 className="font-medium text-gray-900 mb-4">Session-by-Session Comparison</h5>
            <div className="space-y-4">
              {confidenceTrend.map((session, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {session.session}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Session {session.session}</div>
                      <div className="text-sm text-gray-500">{session.scenario}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-sm text-gray-500">Before</div>
                      <div className="font-medium">{session.before}/10</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500">After</div>
                      <div className="font-medium">{session.after}/10</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-bold ${session.improvement > 0 ? 'text-green-600' : session.improvement < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                        {session.improvement > 0 ? '+' : ''}{session.improvement}
                      </div>
                      <div className="text-xs text-gray-500">Change</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Scenario Breakdown */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-6">Scenario Breakdown</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenarios.map((scenario) => {
            const scenarioData = feedbackData.filter(f => f.scenario === scenario);
            const scenarioAvg = calculateAverageConfidence(scenarioData);
            const scenarioImprovement = getImprovementPercentage(scenarioData);
            
            return (
              <div key={scenario} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-900">{scenario}</h5>
                  <Target className="w-4 h-4 text-purple-500" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Before:</span>
                    <span className="font-medium">{scenarioAvg.before}/10</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">After:</span>
                    <span className="font-medium">{scenarioAvg.after}/10</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Improvement:</span>
                    <span className={`font-medium ${scenarioImprovement > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {scenarioImprovement > 0 ? '+' : ''}{scenarioImprovement}
                    </span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    {scenarioData.length} session{scenarioData.length !== 1 ? 's' : ''} completed
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 