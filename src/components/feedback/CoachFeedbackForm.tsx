'use client';

import { useState } from 'react';
import { 
  Users, 
  Target, 
  Star, 
  MessageSquare,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  Save,
  Send
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'player' | 'coach' | 'admin';
}

interface CoachFeedbackFormProps {
  players: User[];
  onFeedbackCreated: () => void;
}

interface FeedbackFormData {
  playerId: string;
  sessionNumber: number;
  confidenceBefore: number;
  confidenceAfter: number;
  scenario: string;
  feedback: string;
  strengths: string[];
  actionItems: string[];
  rating: number;
}

const SCENARIOS = [
  'Finishing',
  'Crossing',
  'Dribbling',
  'Defending',
  'Passing',
  'Shooting',
  'Ball Control',
  'Positioning'
];

const FEEDBACK_TEMPLATES = {
  'Finishing': [
    'Excellent finishing technique',
    'Good composure in front of goal',
    'Needs to work on finishing under pressure',
    'Improve accuracy in one-on-one situations'
  ],
  'Crossing': [
    'Good crossing technique',
    'Excellent delivery accuracy',
    'Needs to improve crossing under pressure',
    'Work on timing and positioning'
  ],
  'Dribbling': [
    'Excellent ball control',
    'Good close control skills',
    'Needs to improve dribbling under pressure',
    'Work on speed and agility'
  ],
  'Defending': [
    'Good defensive positioning',
    'Excellent tackling technique',
    'Needs to improve defensive awareness',
    'Work on marking and tracking'
  ]
};

export default function CoachFeedbackForm({ players, onFeedbackCreated }: CoachFeedbackFormProps) {
  const [formData, setFormData] = useState<FeedbackFormData>({
    playerId: '',
    sessionNumber: 1,
    confidenceBefore: 5,
    confidenceAfter: 7,
    scenario: 'Finishing',
    feedback: '',
    strengths: [],
    actionItems: [],
    rating: 4
  });

  const [newStrength, setNewStrength] = useState('');
  const [newActionItem, setNewActionItem] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  const handleInputChange = (field: keyof FeedbackFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addStrength = () => {
    if (newStrength.trim()) {
      setFormData(prev => ({
        ...prev,
        strengths: [...prev.strengths, newStrength.trim()]
      }));
      setNewStrength('');
    }
  };

  const removeStrength = (index: number) => {
    setFormData(prev => ({
      ...prev,
      strengths: prev.strengths.filter((_, i) => i !== index)
    }));
  };

  const addActionItem = () => {
    if (newActionItem.trim()) {
      setFormData(prev => ({
        ...prev,
        actionItems: [...prev.actionItems, newActionItem.trim()]
      }));
      setNewActionItem('');
    }
  };

  const removeActionItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      actionItems: prev.actionItems.filter((_, i) => i !== index)
    }));
  };

  const addTemplateFeedback = (template: string) => {
    setFormData(prev => ({
      ...prev,
      feedback: prev.feedback + (prev.feedback ? '\n\n' : '') + template
    }));
    setShowTemplates(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Reset form
        setFormData({
          playerId: '',
          sessionNumber: 1,
          confidenceBefore: 5,
          confidenceAfter: 7,
          scenario: 'Finishing',
          feedback: '',
          strengths: [],
          actionItems: [],
          rating: 4
        });
        onFeedbackCreated();
        alert('Feedback submitted successfully!');
      } else {
        throw new Error('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Error submitting feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getImprovementColor = () => {
    const improvement = formData.confidenceAfter - formData.confidenceBefore;
    if (improvement > 2) return 'text-green-600';
    if (improvement > 0) return 'text-blue-600';
    if (improvement < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Create Session Feedback</h2>
          <MessageSquare className="w-8 h-8 text-blue-500" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Session Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Player
              </label>
              <select
                value={formData.playerId}
                onChange={(e) => handleInputChange('playerId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Choose a player...</option>
                {players.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Number
              </label>
              <select
                value={formData.sessionNumber}
                onChange={(e) => handleInputChange('sessionNumber', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                {Array.from({ length: 8 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Session {i + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Scenario Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Training Scenario
            </label>
            <select
              value={formData.scenario}
              onChange={(e) => handleInputChange('scenario', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              {SCENARIOS.map((scenario) => (
                <option key={scenario} value={scenario}>
                  {scenario}
                </option>
              ))}
            </select>
          </div>

          {/* Confidence Ratings */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confidence Ratings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Before Session Confidence
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.confidenceBefore}
                    onChange={(e) => handleInputChange('confidenceBefore', parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-lg font-bold text-gray-900 w-8 text-center">
                    {formData.confidenceBefore}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 - Low</span>
                  <span>10 - High</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  After Session Confidence
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.confidenceAfter}
                    onChange={(e) => handleInputChange('confidenceAfter', parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-lg font-bold text-gray-900 w-8 text-center">
                    {formData.confidenceAfter}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 - Low</span>
                  <span>10 - High</span>
                </div>
              </div>
            </div>

            {/* Improvement Display */}
            <div className="mt-4 p-4 bg-white rounded-lg border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Confidence Improvement:</span>
                <span className={`text-lg font-bold ${getImprovementColor()}`}>
                  {formData.confidenceAfter - formData.confidenceBefore > 0 ? '+' : ''}
                  {formData.confidenceAfter - formData.confidenceBefore}
                </span>
              </div>
            </div>
          </div>

          {/* Overall Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Overall Session Rating
            </label>
            <div className="flex items-center space-x-2">
              {Array.from({ length: 5 }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleInputChange('rating', i + 1)}
                  className={`p-2 rounded-lg transition-colors ${
                    i < formData.rating
                      ? 'text-yellow-400 bg-yellow-50'
                      : 'text-gray-300 hover:text-yellow-400'
                  }`}
                >
                  <Star className="w-6 h-6 fill-current" />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {formData.rating} out of 5
              </span>
            </div>
          </div>

          {/* Written Feedback */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Session Feedback
              </label>
              <button
                type="button"
                onClick={() => setShowTemplates(!showTemplates)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Use Templates
              </button>
            </div>
            
            {showTemplates && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Feedback Templates for {formData.scenario}:</h4>
                <div className="space-y-2">
                  {FEEDBACK_TEMPLATES[formData.scenario as keyof typeof FEEDBACK_TEMPLATES]?.map((template, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => addTemplateFeedback(template)}
                      className="block w-full text-left p-2 text-sm text-gray-700 hover:bg-white rounded border"
                    >
                      {template}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <textarea
              value={formData.feedback}
              onChange={(e) => handleInputChange('feedback', e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Provide detailed feedback about the session..."
              required
            />
          </div>

          {/* Strengths */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Strengths Noted
            </label>
            <div className="space-y-2">
              {formData.strengths.map((strength, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="flex-1 text-sm">{strength}</span>
                  <button
                    type="button"
                    onClick={() => removeStrength(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newStrength}
                  onChange={(e) => setNewStrength(e.target.value)}
                  placeholder="Add a strength..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={addStrength}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Action Items */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Action Items for Improvement
            </label>
            <div className="space-y-2">
              {formData.actionItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-yellow-50 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                  <span className="flex-1 text-sm">{item}</span>
                  <button
                    type="button"
                    onClick={() => removeActionItem(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newActionItem}
                  onChange={(e) => setNewActionItem(e.target.value)}
                  placeholder="Add an action item..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={addActionItem}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => {
                // Save as draft functionality
                console.log('Saving as draft...');
              }}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <Save className="w-4 h-4 inline mr-2" />
              Save Draft
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              <Send className="w-4 h-4 inline mr-2" />
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 