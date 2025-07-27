'use client';

import { useState, useEffect } from 'react';
import { 
  Award, 
  Download, 
  Plus, 
  CheckCircle,
  Calendar,
  Star,
  Target,
  TrendingUp,
  Users,
  FileText,
  Eye
} from 'lucide-react';

interface Course {
  id: string;
  name: string;
  description: string;
  durationWeeks: number;
}

interface Player {
  id: string;
  name: string;
  email: string;
  position: string;
  profile?: {
    playerName: string;
    position: string;
  };
}

interface CertificateGeneratorProps {
  courses: Course[];
  onCertificateGenerated: () => void;
}

interface CompletionCandidate {
  playerId: string;
  playerName: string;
  courseId: string;
  courseName: string;
  sessionsCompleted: number;
  improvementPercentage: number;
  position: string;
  coachName: string;
  completionDate: Date;
}

export default function CertificateGenerator({ 
  courses, 
  onCertificateGenerated 
}: CertificateGeneratorProps) {
  const [completionCandidates, setCompletionCandidates] = useState<CompletionCandidate[]>([]);
  const [selectedCandidate, setSelectedCertificate] = useState<CompletionCandidate | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCertificate, setGeneratedCertificate] = useState<any>(null);
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    fetchCompletionCandidates();
    fetchPlayers();
  }, []);

  const fetchCompletionCandidates = async () => {
    try {
      const response = await fetch('/api/certificates/completion-candidates');
      if (response.ok) {
        const data = await response.json();
        setCompletionCandidates(data.candidates);
      }
    } catch (error) {
      console.error('Error fetching completion candidates:', error);
    }
  };

  const fetchPlayers = async () => {
    try {
      const response = await fetch('/api/users?role=player');
      if (response.ok) {
        const data = await response.json();
        setPlayers(data.users);
      }
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  const handleGenerateCertificate = async (candidate: CompletionCandidate) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/certificates/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerId: candidate.playerId,
          courseId: candidate.courseId,
          playerName: candidate.playerName,
          courseName: candidate.courseName,
          position: candidate.position,
          improvementPercentage: candidate.improvementPercentage,
          totalSessionsCompleted: candidate.sessionsCompleted,
          completionDate: candidate.completionDate,
          coachName: candidate.coachName
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedCertificate(data.certificate);
        onCertificateGenerated();
        alert('Certificate generated successfully!');
      } else {
        throw new Error('Failed to generate certificate');
      }
    } catch (error) {
      console.error('Error generating certificate:', error);
      alert('Error generating certificate. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleManualGeneration = async (formData: any) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/certificates/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedCertificate(data.certificate);
        onCertificateGenerated();
        alert('Certificate generated successfully!');
      } else {
        throw new Error('Failed to generate certificate');
      }
    } catch (error) {
      console.error('Error generating certificate:', error);
      alert('Error generating certificate. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Automatic Completion Detection */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Automatic Completion Detection</h3>
          <CheckCircle className="w-6 h-6 text-green-500" />
        </div>

        {completionCandidates.length > 0 ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              The following players have completed all requirements and are ready for certificate generation:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completionCandidates.map((candidate, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{candidate.playerName}</h4>
                      <p className="text-sm text-gray-600">{candidate.courseName}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Position</div>
                      <div className="font-medium text-gray-900">{candidate.position}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{candidate.sessionsCompleted}/8</div>
                      <div className="text-xs text-gray-500">Sessions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">+{candidate.improvementPercentage}%</div>
                      <div className="text-xs text-gray-500">Improvement</div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleGenerateCertificate(candidate)}
                      disabled={isGenerating}
                      className="flex-1 flex items-center justify-center space-x-2 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-50 transition-colors"
                    >
                      <Award className="w-4 h-4" />
                      <span>{isGenerating ? 'Generating...' : 'Generate'}</span>
                    </button>
                    <button
                      onClick={() => setSelectedCertificate(candidate)}
                      className="flex-1 flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Preview</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No completions ready</h4>
            <p className="text-gray-500">
              All players who have completed courses already have certificates generated.
            </p>
          </div>
        )}
      </div>

      {/* Manual Certificate Generation */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Manual Certificate Generation</h3>
          <Plus className="w-6 h-6 text-blue-500" />
        </div>

        <ManualCertificateForm 
          players={players}
          courses={courses}
          onGenerate={handleManualGeneration}
          isGenerating={isGenerating}
        />
      </div>

      {/* Generated Certificate Preview */}
      {generatedCertificate && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Generated Certificate</h3>
            <Award className="w-6 h-6 text-green-500" />
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <div className="text-center">
              <Award className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                Certificate Generated Successfully!
              </h4>
              <p className="text-gray-600 mb-4">
                Certificate ID: {generatedCertificate.certificateId}
              </p>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => {
                    // Download functionality
                    console.log('Download certificate');
                  }}
                  className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={() => setGeneratedCertificate(null)}
                  className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  <span>Close</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Preview Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Certificate Preview</h2>
                <button
                  onClick={() => setSelectedCertificate(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Player Name</label>
                    <p className="text-lg font-semibold">{selectedCandidate.playerName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Course</label>
                    <p className="text-lg font-semibold">{selectedCandidate.courseName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Position</label>
                    <p className="text-lg font-semibold">{selectedCandidate.position}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Coach</label>
                    <p className="text-lg font-semibold">{selectedCandidate.coachName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Sessions Completed</label>
                    <p className="text-lg font-semibold">{selectedCandidate.sessionsCompleted}/8</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Improvement</label>
                    <p className="text-lg font-semibold text-green-600">+{selectedCandidate.improvementPercentage}%</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Completion Date</label>
                    <p className="text-lg font-semibold">{new Date(selectedCandidate.completionDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex space-x-3 pt-6 border-t">
                  <button
                    onClick={() => {
                      handleGenerateCertificate(selectedCandidate);
                      setSelectedCertificate(null);
                    }}
                    disabled={isGenerating}
                    className="flex-1 flex items-center justify-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 transition-colors"
                  >
                    <Award className="w-4 h-4" />
                    <span>{isGenerating ? 'Generating...' : 'Generate Certificate'}</span>
                  </button>
                  <button
                    onClick={() => setSelectedCertificate(null)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Manual Certificate Form Component
function ManualCertificateForm({ 
  players, 
  courses, 
  onGenerate, 
  isGenerating 
}: {
  players: Player[];
  courses: Course[];
  onGenerate: (data: any) => void;
  isGenerating: boolean;
}) {
  const [formData, setFormData] = useState({
    playerId: '',
    courseId: '',
    playerName: '',
    courseName: '',
    position: '',
    improvementPercentage: 0,
    totalSessionsCompleted: 8,
    completionDate: new Date().toISOString().split('T')[0],
    coachName: 'Coach Josh'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Player</label>
          <select
            value={formData.playerId}
            onChange={(e) => {
              const player = players.find(p => p.id === e.target.value);
              handleInputChange('playerId', e.target.value);
              if (player) {
                handleInputChange('playerName', player.name);
                handleInputChange('position', player.profile?.position || 'Unknown');
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select a player...</option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
          <select
            value={formData.courseId}
            onChange={(e) => {
              const course = courses.find(c => c.id === e.target.value);
              handleInputChange('courseId', e.target.value);
              if (course) {
                handleInputChange('courseName', course.name);
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select a course...</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
          <input
            type="text"
            value={formData.position}
            onChange={(e) => handleInputChange('position', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Improvement Percentage</label>
          <input
            type="number"
            min="0"
            max="100"
            value={formData.improvementPercentage}
            onChange={(e) => handleInputChange('improvementPercentage', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sessions Completed</label>
          <input
            type="number"
            min="1"
            max="8"
            value={formData.totalSessionsCompleted}
            onChange={(e) => handleInputChange('totalSessionsCompleted', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Completion Date</label>
          <input
            type="date"
            value={formData.completionDate}
            onChange={(e) => handleInputChange('completionDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t">
        <button
          type="submit"
          disabled={isGenerating}
          className="flex items-center space-x-2 bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 transition-colors"
        >
          <Award className="w-4 h-4" />
          <span>{isGenerating ? 'Generating...' : 'Generate Certificate'}</span>
        </button>
      </div>
    </form>
  );
} 