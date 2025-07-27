'use client';

import { useState } from 'react';
import { 
  QrCode, 
  Search, 
  CheckCircle, 
  XCircle,
  Award,
  Calendar,
  Star,
  Copy,
  ExternalLink
} from 'lucide-react';

interface CertificateVerificationProps {}

interface CertificateDetails {
  id: string;
  certificateId: string;
  playerName: string;
  courseName: string;
  completionDate: Date;
  improvementPercentage: number;
  totalSessionsCompleted: number;
  position: string;
  coachName: string;
  issuedDate: Date;
  status: 'valid' | 'invalid' | 'expired';
}

export default function CertificateVerification({}: CertificateVerificationProps) {
  const [certificateId, setCertificateId] = useState('');
  const [verificationResult, setVerificationResult] = useState<CertificateDetails | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'valid' | 'invalid' | 'not-found'>('idle');

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certificateId.trim()) return;

    setIsVerifying(true);
    setVerificationStatus('idle');

    try {
      const response = await fetch(`/api/certificates/verify/${certificateId}`);
      if (response.ok) {
        const data = await response.json();
        setVerificationResult(data.certificate);
        setVerificationStatus('valid');
      } else if (response.status === 404) {
        setVerificationResult(null);
        setVerificationStatus('not-found');
      } else {
        setVerificationResult(null);
        setVerificationStatus('invalid');
      }
    } catch (error) {
      console.error('Error verifying certificate:', error);
      setVerificationResult(null);
      setVerificationStatus('invalid');
    } finally {
      setIsVerifying(false);
    }
  };

  const copyVerificationUrl = async () => {
    const verificationUrl = `${window.location.origin}/verify/${certificateId}`;
    try {
      await navigator.clipboard.writeText(verificationUrl);
      alert('Verification URL copied to clipboard!');
    } catch (error) {
      console.error('Error copying URL:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid': return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'invalid': return <XCircle className="w-6 h-6 text-red-500" />;
      case 'expired': return <XCircle className="w-6 h-6 text-yellow-500" />;
      default: return <XCircle className="w-6 h-6 text-red-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid': return 'bg-green-100 text-green-800';
      case 'invalid': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Verification Form */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Certificate Verification</h3>
          <QrCode className="w-6 h-6 text-blue-500" />
        </div>

        <form onSubmit={handleVerification} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certificate ID
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
                placeholder="Enter certificate ID (e.g., REBALL-2024-001)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <button
                type="submit"
                disabled={isVerifying || !certificateId.trim()}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
              >
                <Search className="w-4 h-4 inline mr-2" />
                {isVerifying ? 'Verifying...' : 'Verify'}
              </button>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <p>Enter the certificate ID to verify its authenticity. You can find this ID on the certificate document.</p>
          </div>
        </form>
      </div>

      {/* Verification Result */}
      {verificationStatus !== 'idle' && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-gray-900">Verification Result</h4>
            {verificationStatus === 'valid' && getStatusIcon('valid')}
            {verificationStatus === 'invalid' && getStatusIcon('invalid')}
            {verificationStatus === 'not-found' && getStatusIcon('invalid')}
          </div>

          {verificationStatus === 'valid' && verificationResult && (
            <div className="space-y-6">
              {/* Status Badge */}
              <div className="flex items-center space-x-3">
                <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(verificationResult.status)}`}>
                  {getStatusIcon(verificationResult.status)}
                  <span>Certificate {verificationResult.status}</span>
                </div>
              </div>

              {/* Certificate Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Certificate ID</label>
                    <p className="text-lg font-semibold">{verificationResult.certificateId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Player Name</label>
                    <p className="text-lg font-semibold">{verificationResult.playerName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Course</label>
                    <p className="text-lg font-semibold">{verificationResult.courseName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Position</label>
                    <p className="text-lg font-semibold">{verificationResult.position}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Coach</label>
                    <p className="text-lg font-semibold">{verificationResult.coachName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Completion Date</label>
                    <p className="text-lg font-semibold">{new Date(verificationResult.completionDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Issued Date</label>
                    <p className="text-lg font-semibold">{new Date(verificationResult.issuedDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Sessions Completed</label>
                    <p className="text-lg font-semibold">{verificationResult.totalSessionsCompleted}/8</p>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h5 className="font-medium text-gray-900 mb-4">Performance Metrics</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      +{verificationResult.improvementPercentage}%
                    </div>
                    <div className="text-sm text-gray-600">Confidence Improvement</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {verificationResult.totalSessionsCompleted}
                    </div>
                    <div className="text-sm text-gray-600">Sessions Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {Math.round((verificationResult.totalSessionsCompleted / 8) * 100)}%
                    </div>
                    <div className="text-sm text-gray-600">Course Completion</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-4 pt-6 border-t">
                <button
                  onClick={copyVerificationUrl}
                  className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Verification URL</span>
                </button>
                <button
                  onClick={() => window.open(`/api/certificates/${verificationResult.id}/download`, '_blank')}
                  className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Download Certificate</span>
                </button>
              </div>
            </div>
          )}

          {verificationStatus === 'invalid' && (
            <div className="text-center py-8">
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Invalid Certificate</h4>
              <p className="text-gray-500">
                The certificate ID you entered is invalid or has been tampered with.
              </p>
            </div>
          )}

          {verificationStatus === 'not-found' && (
            <div className="text-center py-8">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Certificate Not Found</h4>
              <p className="text-gray-500">
                No certificate found with the provided ID. Please check the ID and try again.
              </p>
            </div>
          )}
        </div>
      )}

      {/* QR Code Information */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-semibold text-gray-900">QR Code Verification</h4>
          <QrCode className="w-6 h-6 text-blue-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium text-gray-900 mb-3">How to Verify with QR Code</h5>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <p>Scan the QR code on your certificate with your phone's camera</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <p>The QR code will direct you to this verification page</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <p>View the certificate details and verify authenticity</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="w-32 h-32 bg-white rounded-lg border-2 border-dashed border-gray-300 mx-auto mb-4 flex items-center justify-center">
              <QrCode className="w-16 h-16 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">QR Code Placeholder</p>
            <p className="text-xs text-gray-400 mt-1">Scan to verify certificate</p>
          </div>
        </div>
      </div>

      {/* Security Information */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Security Features</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6 text-blue-500" />
            </div>
            <h5 className="font-medium text-gray-900 mb-2">Unique Certificate IDs</h5>
            <p className="text-sm text-gray-600">
              Each certificate has a unique identifier that cannot be duplicated
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <h5 className="font-medium text-gray-900 mb-2">Digital Verification</h5>
            <p className="text-sm text-gray-600">
              All certificates are verified through our secure database
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <QrCode className="w-6 h-6 text-purple-500" />
            </div>
            <h5 className="font-medium text-gray-900 mb-2">QR Code Integration</h5>
            <p className="text-sm text-gray-600">
              QR codes provide instant verification and prevent forgery
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 