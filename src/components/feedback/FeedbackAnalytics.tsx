'use client';

import { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Target,
  Star,
  Calendar,
  Award,
  CheckCircle,
  AlertCircle,
  Filter
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

interface User {
  id: string;
  name: string;
  email: string;
  role: 'player' | 'coach' | 'admin';
}

interface FeedbackAnalyticsProps {
  feedbackData: FeedbackData[];
  players: User[];
}

export default function FeedbackAnalytics({ feedbackData, players }: FeedbackAnalyticsProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<string>('all');
  const [selectedScenario, setSelectedScenario] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  const scenarios = Array.from(new Set(feedbackData.map(f => f.scenario)));

  const getFilteredData = () => {
    let filtered = feedbackData;

    if (selectedPlayer !== 'all') {
      filtered = filtered.filter(f => f.playerId === selectedPlayer);
    }

    if (selectedScenario !== 'all') {
      filtered = filtered.filter(f => f.scenario === selectedScenario);
    }

    // Filter by time range
    const now = new Date();
    const timeRanges = {
      week: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      month: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      quarter: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
      year: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
    };

    filtered = filtered.filter(f => new Date(f.createdAt) >= timeRanges[timeRange]);

    return filtered;
  };

  const filteredData = getFilteredData();

  const calculateOverallStats = () => {
    if (!filteredData.length) return {
      totalSessions: 0,
      averageImprovement: 0,
      averageRating: 0,
      totalPlayers: 0
    };

    const totalSessions = filteredData.length;
    const averageImprovement = filteredData.reduce((sum, f) => sum + (f.confidenceAfter - f.confidenceBefore), 0) / totalSessions;
    const averageRating = filteredData.reduce((sum, f) => sum + f.rating, 0) / totalSessions;
    const totalPlayers = new Set(filteredData.map(f => f.playerId)).size;

    return {
      totalSessions,
      averageImprovement: Math.round(averageImprovement * 10) / 10,
      averageRating: Math.round(averageRating * 10) / 10,
      totalPlayers
    };
  };

  const getScenarioBreakdown = () => {
    const breakdown = scenarios.map(scenario => {
      const scenarioData = filteredData.filter(f => f.scenario === scenario);
      const avgImprovement = scenarioData.reduce((sum, f) => sum + (f.confidenceAfter - f.confidenceBefore), 0) / scenarioData.length;
      const avgRating = scenarioData.reduce((sum, f) => sum + f.rating, 0) / scenarioData.length;

      return {
        scenario,
        sessions: scenarioData.length,
        avgImprovement: Math.round(avgImprovement * 10) / 10,
        avgRating: Math.round(avgRating * 10) / 10
      };
    });

    return breakdown.sort((a, b) => b.avgImprovement - a.avgImprovement);
  };

  const getPlayerPerformance = () => {
    const playerStats = players.map(player => {
      const playerData = filteredData.filter(f => f.playerId === player.id);
      if (!playerData.length) return null;

      const avgImprovement = playerData.reduce((sum, f) => sum + (f.confidenceAfter - f.confidenceBefore), 0) / playerData.length;
      const avgRating = playerData.reduce((sum, f) => sum + f.rating, 0) / playerData.length;

      return {
        player: player.name,
        sessions: playerData.length,
        avgImprovement: Math.round(avgImprovement * 10) / 10,
        avgRating: Math.round(avgRating * 10) / 10
      };
    }).filter(Boolean);

    return playerStats.sort((a, b) => b!.avgImprovement - a!.avgImprovement);
  };

  const getTrendData = () => {
    const trendData = filteredData
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .map((session, index) => ({
        session: session.sessionNumber,
        improvement: session.confidenceAfter - session.confidenceBefore,
        rating: session.rating,
        date: new Date(session.createdAt).toLocaleDateString()
      }));

    return trendData;
  };

  const overallStats = calculateOverallStats();
  const scenarioBreakdown = getScenarioBreakdown();
  const playerPerformance = getPlayerPerformance();
  const trendData = getTrendData();

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Feedback Analytics</h3>
          <BarChart3 className="w-6 h-6 text-blue-500" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Player</label>
            <select
              value={selectedPlayer}
              onChange={(e) => setSelectedPlayer(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Players</option>
              {players.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Scenario</label>
            <select
              value={selectedScenario}
              onChange={(e) => setSelectedScenario(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Scenarios</option>
              {scenarios.map((scenario) => (
                <option key={scenario} value={scenario}>
                  {scenario}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as 'week' | 'month' | 'quarter' | 'year')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
          </div>

          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              <Filter className="w-4 h-4 inline mr-2" />
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Total Sessions</h4>
            <Calendar className="w-6 h-6 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {overallStats.totalSessions}
          </div>
          <div className="text-sm text-gray-500">Feedback sessions</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Avg. Improvement</h4>
            <TrendingUp className="w-6 h-6 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-green-600 mb-2">
            +{overallStats.averageImprovement}
          </div>
          <div className="text-sm text-gray-500">Confidence points</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Avg. Rating</h4>
            <Star className="w-6 h-6 text-yellow-500" />
          </div>
          <div className="text-3xl font-bold text-yellow-600 mb-2">
            {overallStats.averageRating}
          </div>
          <div className="text-sm text-gray-500">Out of 5 stars</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Active Players</h4>
            <Users className="w-6 h-6 text-purple-500" />
          </div>
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {overallStats.totalPlayers}
          </div>
          <div className="text-sm text-gray-500">With feedback</div>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-6">Improvement Trend</h4>
        {trendData.length > 0 ? (
          <ProgressChart
            data={trendData}
            type="line"
            xKey="session"
            yKey="improvement"
            title="Confidence Improvement Over Time"
            color="#10b981"
            height={300}
          />
        ) : (
          <div className="text-center py-8">
            <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No trend data available</p>
          </div>
        )}
      </div>

      {/* Scenario Breakdown */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-6">Scenario Performance</h4>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <ProgressChart
              data={scenarioBreakdown}
              type="bar"
              xKey="scenario"
              yKey="avgImprovement"
              title="Average Improvement by Scenario"
              color="#3b82f6"
              height={300}
            />
          </div>
          <div className="space-y-4">
            {scenarioBreakdown.map((scenario, index) => (
              <div key={scenario.scenario} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{scenario.scenario}</div>
                    <div className="text-sm text-gray-500">{scenario.sessions} sessions</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${scenario.avgImprovement > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {scenario.avgImprovement > 0 ? '+' : ''}{scenario.avgImprovement}
                  </div>
                  <div className="text-xs text-gray-500">avg. improvement</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Player Performance */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-6">Player Performance</h4>
        <div className="space-y-4">
          {playerPerformance.map((player, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-purple-600">
                    {index + 1}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">{player!.player}</div>
                  <div className="text-sm text-gray-500">{player!.sessions} sessions</div>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className={`text-lg font-bold ${player!.avgImprovement > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {player!.avgImprovement > 0 ? '+' : ''}{player!.avgImprovement}
                  </div>
                  <div className="text-xs text-gray-500">avg. improvement</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-600">
                    {player!.avgRating}
                  </div>
                  <div className="text-xs text-gray-500">avg. rating</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coaching Effectiveness */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-6">Coaching Effectiveness</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-green-50 rounded-lg">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h5 className="font-medium text-gray-900 mb-2">High Improvement</h5>
            <div className="text-2xl font-bold text-green-600">
              {filteredData.filter(f => f.confidenceAfter - f.confidenceBefore > 2).length}
            </div>
            <div className="text-sm text-gray-500">sessions</div>
          </div>

          <div className="text-center p-6 bg-yellow-50 rounded-lg">
            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h5 className="font-medium text-gray-900 mb-2">Moderate Improvement</h5>
            <div className="text-2xl font-bold text-yellow-600">
              {filteredData.filter(f => f.confidenceAfter - f.confidenceBefore > 0 && f.confidenceAfter - f.confidenceBefore <= 2).length}
            </div>
            <div className="text-sm text-gray-500">sessions</div>
          </div>

          <div className="text-center p-6 bg-red-50 rounded-lg">
            <Award className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h5 className="font-medium text-gray-900 mb-2">Needs Attention</h5>
            <div className="text-2xl font-bold text-red-600">
              {filteredData.filter(f => f.confidenceAfter - f.confidenceBefore <= 0).length}
            </div>
            <div className="text-sm text-gray-500">sessions</div>
          </div>
        </div>
      </div>
    </div>
  );
} 