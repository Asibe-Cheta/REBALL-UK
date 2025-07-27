'use client';

import { useState } from 'react';
import { 
  Target, 
  Play, 
  CheckCircle, 
  Clock, 
  Star,
  Video,
  TrendingUp,
  Award,
  Zap,
  Shield,
  Crosshair,
  ArrowRight,
  BarChart3
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

interface ScenarioMasteryProps {
  progressData: ProgressData[];
}

interface ScenarioCategory {
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  masteryLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  progress: number;
  sessionsCompleted: number;
  averageImprovement: number;
  bestSession?: ProgressData;
}

export default function ScenarioMastery({ progressData }: ScenarioMasteryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const scenarioCategories: ScenarioCategory[] = [
    {
      name: 'Finishing',
      icon: <Target className="w-6 h-6" />,
      color: 'text-red-600',
      description: 'Goal-scoring techniques and finishing skills',
      masteryLevel: 'intermediate',
      progress: 75,
      sessionsCompleted: 3,
      averageImprovement: 2.3,
      bestSession: progressData.find(p => p.scenario === 'Finishing' && p.sessionNumber === 2)
    },
    {
      name: 'Crossing',
      icon: <Crosshair className="w-6 h-6" />,
      color: 'text-blue-600',
      description: 'Crossing and delivery techniques',
      masteryLevel: 'beginner',
      progress: 45,
      sessionsCompleted: 2,
      averageImprovement: 1.8,
      bestSession: progressData.find(p => p.scenario === 'Crossing' && p.sessionNumber === 1)
    },
    {
      name: 'Dribbling',
      icon: <Zap className="w-6 h-6" />,
      color: 'text-green-600',
      description: 'Ball control and dribbling skills',
      masteryLevel: 'advanced',
      progress: 90,
      sessionsCompleted: 4,
      averageImprovement: 3.1,
      bestSession: progressData.find(p => p.scenario === 'Dribbling' && p.sessionNumber === 3)
    },
    {
      name: 'Defending',
      icon: <Shield className="w-6 h-6" />,
      color: 'text-purple-600',
      description: 'Defensive positioning and tackling',
      masteryLevel: 'intermediate',
      progress: 60,
      sessionsCompleted: 2,
      averageImprovement: 2.0,
      bestSession: progressData.find(p => p.scenario === 'Defending' && p.sessionNumber === 1)
    },
    {
      name: 'Passing',
      icon: <ArrowRight className="w-6 h-6" />,
      color: 'text-orange-600',
      description: 'Passing accuracy and vision',
      masteryLevel: 'expert',
      progress: 95,
      sessionsCompleted: 5,
      averageImprovement: 3.5,
      bestSession: progressData.find(p => p.scenario === 'Passing' && p.sessionNumber === 4)
    },
    {
      name: 'Shooting',
      icon: <Target className="w-6 h-6" />,
      color: 'text-pink-600',
      description: 'Shooting techniques and power',
      masteryLevel: 'beginner',
      progress: 30,
      sessionsCompleted: 1,
      averageImprovement: 1.2,
      bestSession: progressData.find(p => p.scenario === 'Shooting' && p.sessionNumber === 1)
    }
  ];

  const getMasteryColor = (level: string) => {
    switch (level) {
      case 'expert': return 'text-purple-600 bg-purple-100';
      case 'advanced': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-blue-600 bg-blue-100';
      case 'beginner': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getMasteryIcon = (level: string) => {
    switch (level) {
      case 'expert': return <Award className="w-4 h-4" />;
      case 'advanced': return <Star className="w-4 h-4" />;
      case 'intermediate': return <Target className="w-4 h-4" />;
      case 'beginner': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const filteredCategories = selectedCategory === 'all' 
    ? scenarioCategories 
    : scenarioCategories.filter(cat => cat.name === selectedCategory);

  const getScenarioData = (scenarioName: string) => {
    return progressData.filter(p => p.scenario === scenarioName);
  };

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Scenario Mastery</h3>
          <Target className="w-6 h-6 text-purple-500" />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Scenarios
          </button>
          {scenarioCategories.map((category) => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category.name
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Scenario Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => {
          const scenarioData = getScenarioData(category.name);
          
          return (
            <div key={category.name} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${category.color.replace('text-', 'bg-').replace('-600', '-100')}`}>
                    {category.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{category.name}</h4>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getMasteryColor(category.masteryLevel)}`}>
                  <div className="flex items-center space-x-1">
                    {getMasteryIcon(category.masteryLevel)}
                    <span>{category.masteryLevel}</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Mastery Progress</span>
                  <span className="font-medium">{category.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(category.progress)}`}
                    style={{ width: `${category.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{category.sessionsCompleted}</div>
                  <div className="text-xs text-gray-500">Sessions</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${category.averageImprovement > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    +{category.averageImprovement}
                  </div>
                  <div className="text-xs text-gray-500">Avg. Improvement</div>
                </div>
              </div>

              {/* Best Session */}
              {category.bestSession && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">Best Session</span>
                    <span className="text-xs text-gray-500">Session {category.bestSession.sessionNumber}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Improvement:</span>
                    <span className="font-medium text-green-600">
                      +{((category.bestSession.confidenceAfter || 0) - (category.bestSession.confidenceBefore || 0))}
                    </span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2">
                <button className="flex-1 flex items-center justify-center space-x-2 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                  <Video className="w-4 h-4" />
                  <span>Watch Videos</span>
                </button>
                <button className="flex-1 flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                  <BarChart3 className="w-4 h-4" />
                  <span>Details</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mastery Overview */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-6">Mastery Overview</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award className="w-8 h-8 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {scenarioCategories.filter(cat => cat.masteryLevel === 'expert').length}
            </div>
            <div className="text-sm text-gray-500">Expert Level</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Star className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {scenarioCategories.filter(cat => cat.masteryLevel === 'advanced').length}
            </div>
            <div className="text-sm text-gray-500">Advanced Level</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {scenarioCategories.filter(cat => cat.masteryLevel === 'intermediate').length}
            </div>
            <div className="text-sm text-gray-500">Intermediate Level</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {scenarioCategories.filter(cat => cat.masteryLevel === 'beginner').length}
            </div>
            <div className="text-sm text-gray-500">Beginner Level</div>
          </div>
        </div>
      </div>

      {/* Performance Trends */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-6">Performance Trends</h4>
        <div className="space-y-4">
          {scenarioCategories
            .sort((a, b) => b.averageImprovement - a.averageImprovement)
            .slice(0, 5)
            .map((category, index) => (
              <div key={category.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-purple-600">{index + 1}</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{category.name}</div>
                    <div className="text-sm text-gray-500">{category.masteryLevel} level</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${category.averageImprovement > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    +{category.averageImprovement}
                  </div>
                  <div className="text-xs text-gray-500">avg. improvement</div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
} 