'use client';

import { useState } from 'react';
import { 
  Award, 
  TrendingUp, 
  Users, 
  Calendar,
  Star,
  Target,
  CheckCircle,
  BarChart3,
  Trophy,
  Medal
} from 'lucide-react';
import ProgressChart from '../progress/ProgressChart';

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

interface CertificateAnalyticsProps {
  certificates: Certificate[];
  courses: Course[];
}

export default function CertificateAnalytics({ 
  certificates, 
  courses 
}: CertificateAnalyticsProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');

  const getFilteredCertificates = () => {
    let filtered = certificates;

    if (selectedCourse !== 'all') {
      filtered = filtered.filter(c => c.courseId === selectedCourse);
    }

    // Filter by time range
    const now = new Date();
    const timeRanges = {
      week: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      month: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      quarter: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
      year: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
    };

    filtered = filtered.filter(c => new Date(c.issuedDate) >= timeRanges[timeRange]);

    return filtered;
  };

  const filteredCertificates = getFilteredCertificates();

  const calculateOverallStats = () => {
    if (!filteredCertificates.length) return {
      totalCertificates: 0,
      averageImprovement: 0,
      completionRate: 0,
      uniquePlayers: 0
    };

    const totalCertificates = filteredCertificates.length;
    const averageImprovement = filteredCertificates.reduce((sum, c) => sum + c.improvementPercentage, 0) / totalCertificates;
    const uniquePlayers = new Set(filteredCertificates.map(c => c.playerId)).size;

    return {
      totalCertificates,
      averageImprovement: Math.round(averageImprovement * 10) / 10,
      completionRate: Math.round((totalCertificates / (totalCertificates + 5)) * 100), // Mock calculation
      uniquePlayers
    };
  };

  const getIssuanceTrend = () => {
    const trendData = filteredCertificates
      .sort((a, b) => new Date(a.issuedDate).getTime() - new Date(b.issuedDate).getTime())
      .reduce((acc, certificate) => {
        const date = new Date(certificate.issuedDate).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(trendData).map(([date, count]) => ({
      date,
      count
    }));
  };

  const getCourseBreakdown = () => {
    const breakdown = courses.map(course => {
      const courseCertificates = filteredCertificates.filter(c => c.courseId === course.id);
      const avgImprovement = courseCertificates.reduce((sum, c) => sum + c.improvementPercentage, 0) / courseCertificates.length;

      return {
        course: course.name,
        certificates: courseCertificates.length,
        avgImprovement: Math.round(avgImprovement * 10) / 10
      };
    });

    return breakdown.sort((a, b) => b.certificates - a.certificates);
  };

  const getPlayerAchievements = () => {
    const playerStats = filteredCertificates.reduce((acc, certificate) => {
      if (!acc[certificate.playerId]) {
        acc[certificate.playerId] = {
          playerName: certificate.playerName,
          certificates: 0,
          totalImprovement: 0,
          positions: new Set()
        };
      }
      acc[certificate.playerId].certificates++;
      acc[certificate.playerId].totalImprovement += certificate.improvementPercentage;
      acc[certificate.playerId].positions.add(certificate.position);
      return acc;
    }, {} as Record<string, any>);

    return Object.values(playerStats)
      .map(player => ({
        ...player,
        avgImprovement: Math.round(player.totalImprovement / player.certificates * 10) / 10,
        positions: Array.from(player.positions).join(', ')
      }))
      .sort((a, b) => b.certificates - a.certificates)
      .slice(0, 10);
  };

  const overallStats = calculateOverallStats();
  const issuanceTrend = getIssuanceTrend();
  const courseBreakdown = getCourseBreakdown();
  const playerAchievements = getPlayerAchievements();

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Certificate Analytics</h3>
          <BarChart3 className="w-6 h-6 text-blue-500" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Courses</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <div className="text-sm text-gray-500">
              {filteredCertificates.length} certificates in selected period
            </div>
          </div>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Total Certificates</h4>
            <Award className="w-6 h-6 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {overallStats.totalCertificates}
          </div>
          <div className="text-sm text-gray-500">Certificates issued</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Avg. Improvement</h4>
            <TrendingUp className="w-6 h-6 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-green-600 mb-2">
            {overallStats.averageImprovement}%
          </div>
          <div className="text-sm text-gray-500">Confidence improvement</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Completion Rate</h4>
            <CheckCircle className="w-6 h-6 text-purple-500" />
          </div>
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {overallStats.completionRate}%
          </div>
          <div className="text-sm text-gray-500">Course completion</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Active Players</h4>
            <Users className="w-6 h-6 text-orange-500" />
          </div>
          <div className="text-3xl font-bold text-orange-600 mb-2">
            {overallStats.uniquePlayers}
          </div>
          <div className="text-sm text-gray-500">With certificates</div>
        </div>
      </div>

      {/* Issuance Trend Chart */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-6">Certificate Issuance Trend</h4>
        {issuanceTrend.length > 0 ? (
          <ProgressChart
            data={issuanceTrend}
            type="line"
            xKey="date"
            yKey="count"
            title="Certificates Issued Over Time"
            color="#3b82f6"
            height={300}
          />
        ) : (
          <div className="text-center py-8">
            <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No issuance data available</p>
          </div>
        )}
      </div>

      {/* Course Breakdown */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-6">Course Performance</h4>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <ProgressChart
              data={courseBreakdown}
              type="bar"
              xKey="course"
              yKey="certificates"
              title="Certificates by Course"
              color="#10b981"
              height={300}
            />
          </div>
          <div className="space-y-4">
            {courseBreakdown.map((course, index) => (
              <div key={course.course} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-green-600">{index + 1}</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{course.course}</div>
                    <div className="text-sm text-gray-500">{course.certificates} certificates</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">
                    {course.avgImprovement}%
                  </div>
                  <div className="text-xs text-gray-500">avg. improvement</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Player Achievements */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-6">Top Player Achievements</h4>
        <div className="space-y-4">
          {playerAchievements.map((player, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  {index === 0 && <Trophy className="w-6 h-6 text-yellow-500" />}
                  {index === 1 && <Medal className="w-6 h-6 text-gray-500" />}
                  {index === 2 && <Medal className="w-6 h-6 text-orange-500" />}
                  {index > 2 && <span className="text-sm font-medium text-purple-600">{index + 1}</span>}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{player.playerName}</div>
                  <div className="text-sm text-gray-500">{player.positions}</div>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">
                    {player.certificates}
                  </div>
                  <div className="text-xs text-gray-500">certificates</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">
                    {player.avgImprovement}%
                  </div>
                  <div className="text-xs text-gray-500">avg. improvement</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievement Badges */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-6">Achievement Badges</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-yellow-50 rounded-lg">
            <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h5 className="font-medium text-gray-900 mb-2">Course Champion</h5>
            <div className="text-2xl font-bold text-yellow-600">
              {playerAchievements.filter(p => p.certificates >= 3).length}
            </div>
            <div className="text-sm text-gray-500">players with 3+ certificates</div>
          </div>

          <div className="text-center p-6 bg-green-50 rounded-lg">
            <Star className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h5 className="font-medium text-gray-900 mb-2">High Achiever</h5>
            <div className="text-2xl font-bold text-green-600">
              {playerAchievements.filter(p => p.avgImprovement >= 20).length}
            </div>
            <div className="text-sm text-gray-500">players with 20%+ improvement</div>
          </div>

          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <Target className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h5 className="font-medium text-gray-900 mb-2">Multi-Position</h5>
            <div className="text-2xl font-bold text-blue-600">
              {playerAchievements.filter(p => p.positions.split(',').length > 1).length}
            </div>
            <div className="text-sm text-gray-500">players in multiple positions</div>
          </div>
        </div>
      </div>
    </div>
  );
} 