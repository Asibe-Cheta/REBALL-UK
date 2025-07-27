'use client';

import { useState } from 'react';
import {
  Award,
  Download,
  Share2,
  Eye,
  Calendar,
  Star,
  CheckCircle,
  FileText,
  QrCode,
  ExternalLink,
  Copy
} from 'lucide-react';

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

interface CertificateGalleryProps {
  certificates: Certificate[];
  userRole: 'player' | 'coach' | 'admin';
  onCertificateUpdated: () => void;
}

export default function CertificateGallery({
  certificates,
  userRole,
  onCertificateUpdated
}: CertificateGalleryProps) {
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'issued' | 'pending' | 'expired'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCertificates = certificates
    .filter(certificate => {
      const matchesStatus = filterStatus === 'all' || certificate.status === filterStatus;
      const matchesSearch = certificate.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        certificate.courseName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => new Date(b.issuedDate).getTime() - new Date(a.issuedDate).getTime());

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'issued': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'issued': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Calendar className="w-4 h-4" />;
      case 'expired': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const handleDownload = async (certificate: Certificate) => {
    try {
      const response = await fetch(`/api/certificates/${certificate.id}/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `REBALL_Certificate_${certificate.certificateId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading certificate:', error);
      alert('Error downloading certificate. Please try again.');
    }
  };

  const handleShare = async (certificate: Certificate) => {
    const shareUrl = `${window.location.origin}/verify/${certificate.certificateId}`;
    const shareText = `I just completed ${certificate.courseName} with REBALL! Check out my certificate: ${shareUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'REBALL Certificate',
          text: shareText,
          url: shareUrl
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to copying to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        alert('Share text copied to clipboard!');
      } catch (error) {
        console.error('Error copying to clipboard:', error);
      }
    }
  };

  const copyVerificationUrl = async (certificate: Certificate) => {
    const verificationUrl = `${window.location.origin}/verify/${certificate.certificateId}`;
    try {
      await navigator.clipboard.writeText(verificationUrl);
      alert('Verification URL copied to clipboard!');
    } catch (error) {
      console.error('Error copying URL:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Total Certificates</h3>
            <Award className="w-6 h-6 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {certificates.length}
          </div>
          <div className="text-sm text-gray-500">Certificates earned</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Issued</h3>
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-green-600 mb-2">
            {certificates.filter(c => c.status === 'issued').length}
          </div>
          <div className="text-sm text-gray-500">Successfully issued</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Pending</h3>
            <Calendar className="w-6 h-6 text-yellow-500" />
          </div>
          <div className="text-3xl font-bold text-yellow-600 mb-2">
            {certificates.filter(c => c.status === 'pending').length}
          </div>
          <div className="text-sm text-gray-500">Awaiting approval</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Avg. Improvement</h3>
            <Star className="w-6 h-6 text-purple-500" />
          </div>
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {certificates.length > 0
              ? Math.round(certificates.reduce((sum, c) => sum + c.improvementPercentage, 0) / certificates.length)
              : 0}%
          </div>
          <div className="text-sm text-gray-500">Confidence improvement</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search certificates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'issued' | 'pending' | 'expired')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="issued">Issued</option>
              <option value="pending">Pending</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          <div className="text-sm text-gray-500">
            {filteredCertificates.length} certificate{filteredCertificates.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Certificate Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCertificates.map((certificate) => (
          <div key={certificate.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            {/* Certificate Preview */}
            <div className="relative">
              <div className="aspect-[3/2] bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-lg flex items-center justify-center">
                <div className="text-center p-6">
                  <Award className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{certificate.courseName}</h3>
                  <p className="text-sm text-gray-600 mb-4">{certificate.playerName}</p>
                  <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                    <span>ID: {certificate.certificateId}</span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(certificate.status)}`}>
                {getStatusIcon(certificate.status)}
                <span>{certificate.status}</span>
              </div>
            </div>

            {/* Certificate Details */}
            <div className="p-6">
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Course:</span>
                  <span className="font-medium">{certificate.courseName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Player:</span>
                  <span className="font-medium">{certificate.playerName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Position:</span>
                  <span className="font-medium">{certificate.position}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Improvement:</span>
                  <span className="font-medium text-green-600">+{certificate.improvementPercentage}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sessions:</span>
                  <span className="font-medium">{certificate.totalSessionsCompleted}/8</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Issued:</span>
                  <span className="font-medium">{new Date(certificate.issuedDate).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedCertificate(certificate)}
                  className="flex-1 flex items-center justify-center space-x-2 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                </button>
                <button
                  onClick={() => handleDownload(certificate)}
                  className="flex-1 flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
                <button
                  onClick={() => handleShare(certificate)}
                  className="flex-1 flex items-center justify-center space-x-2 bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>

              {/* Verification */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                <button
                  onClick={() => copyVerificationUrl(certificate)}
                  className="w-full flex items-center justify-center space-x-2 text-xs text-gray-500 hover:text-gray-700"
                >
                  <QrCode className="w-3 h-3" />
                  <span>Copy Verification URL</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCertificates.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
          <Award className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No certificates found</h3>
          <p className="text-gray-500">
            {searchTerm || filterStatus !== 'all'
              ? 'Try adjusting your search or filters.'
              : 'Complete a course to earn your first certificate!'
            }
          </p>
        </div>
      )}

      {/* Certificate Modal */}
      {selectedCertificate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Certificate Details</h2>
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
                    <label className="text-sm font-medium text-gray-600">Certificate ID</label>
                    <p className="text-lg font-semibold">{selectedCertificate.certificateId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedCertificate.status)}`}>
                      {getStatusIcon(selectedCertificate.status)}
                      <span>{selectedCertificate.status}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Player Name</label>
                    <p className="text-lg font-semibold">{selectedCertificate.playerName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Course</label>
                    <p className="text-lg font-semibold">{selectedCertificate.courseName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Position</label>
                    <p className="text-lg font-semibold">{selectedCertificate.position}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Coach</label>
                    <p className="text-lg font-semibold">{selectedCertificate.coachName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Improvement</label>
                    <p className="text-lg font-semibold text-green-600">+{selectedCertificate.improvementPercentage}%</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Sessions Completed</label>
                    <p className="text-lg font-semibold">{selectedCertificate.totalSessionsCompleted}/8</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Completion Date</label>
                    <p className="text-lg font-semibold">{new Date(selectedCertificate.completionDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Issued Date</label>
                    <p className="text-lg font-semibold">{new Date(selectedCertificate.issuedDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex space-x-3 pt-6 border-t">
                  <button
                    onClick={() => handleDownload(selectedCertificate)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </button>
                  <button
                    onClick={() => handleShare(selectedCertificate)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                  <button
                    onClick={() => copyVerificationUrl(selectedCertificate)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy URL</span>
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