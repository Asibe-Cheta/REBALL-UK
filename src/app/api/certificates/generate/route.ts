import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      playerId,
      courseId,
      playerName,
      courseName,
      position,
      improvementPercentage,
      totalSessionsCompleted,
      completionDate,
      coachName
    } = body;

    // Generate unique certificate ID
    const certificateId = `REBALL-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // Create certificate entry in database
    const certificate = await prisma.certificate.create({
      data: {
        userId: playerId,
        courseId: courseId,
        certificateUrl: `/certificates/${certificateId}.pdf`,
        issuedDate: new Date()
      },
      include: {
        user: {
          select: {
            name: true,
            firstName: true,
            lastName: true
          }
        },
        course: {
          select: {
            name: true
          }
        }
      }
    });

    // Generate PDF certificate (mock implementation)
    // In a real implementation, you would use a library like puppeteer or jsPDF
    const pdfData = await generateCertificatePDF({
      certificateId,
      playerName,
      courseName,
      position,
      improvementPercentage,
      totalSessionsCompleted,
      completionDate,
      coachName,
      issuedDate: new Date()
    });

    // Transform the response
    const transformedCertificate = {
      id: certificate.id,
      playerId: certificate.userId,
      courseId: certificate.courseId,
      certificateUrl: certificate.certificateUrl,
      certificateId: certificateId,
      playerName: playerName,
      courseName: courseName,
      completionDate: new Date(completionDate),
      improvementPercentage: improvementPercentage,
      totalSessionsCompleted: totalSessionsCompleted,
      position: position,
      coachName: coachName,
      issuedDate: certificate.issuedDate,
      status: 'issued' as const
    };

    return NextResponse.json({
      certificate: transformedCertificate,
      pdfData: pdfData // In real implementation, this would be the PDF buffer
    });

  } catch (error) {
    console.error('Error generating certificate:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Mock PDF generation function
async function generateCertificatePDF(certificateData: {
  certificateId: string;
  playerName: string;
  courseName: string;
  position: string;
  improvementPercentage: number;
  totalSessionsCompleted: number;
  completionDate: Date;
  coachName: string;
  issuedDate: Date;
}) {
  // This is a mock implementation
  // In a real implementation, you would:
  // 1. Use puppeteer to render HTML template to PDF
  // 2. Or use jsPDF to generate PDF programmatically
  // 3. Include REBALL branding and styling
  // 4. Add security features like watermarks

  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          margin: 0;
          padding: 40px;
          background: white;
          color: #1f2937;
        }
        .certificate {
          border: 3px solid #1f2937;
          padding: 40px;
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
          background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
        }
        .header {
          margin-bottom: 40px;
        }
        .logo {
          font-size: 48px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 10px;
        }
        .title {
          font-size: 24px;
          color: #6b7280;
          margin-bottom: 40px;
        }
        .player-name {
          font-size: 36px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 20px;
        }
        .course-name {
          font-size: 28px;
          color: #374151;
          margin-bottom: 30px;
        }
        .details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin: 40px 0;
          text-align: left;
        }
        .detail-item {
          margin-bottom: 15px;
        }
        .detail-label {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 5px;
        }
        .detail-value {
          font-size: 16px;
          font-weight: bold;
          color: #1f2937;
        }
        .signature-section {
          margin-top: 60px;
          display: flex;
          justify-content: space-between;
        }
        .signature {
          text-align: center;
        }
        .signature-line {
          border-top: 2px solid #1f2937;
          width: 200px;
          margin: 10px auto;
        }
        .certificate-id {
          font-size: 12px;
          color: #9ca3af;
          margin-top: 40px;
        }
      </style>
    </head>
    <body>
      <div class="certificate">
        <div class="header">
          <div class="logo">REBALL</div>
          <div class="title">Certificate of Completion</div>
        </div>
        
        <div class="player-name">${certificateData.playerName}</div>
        <div class="course-name">${certificateData.courseName}</div>
        
        <div class="details">
          <div class="detail-item">
            <div class="detail-label">Position</div>
            <div class="detail-value">${certificateData.position}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Improvement</div>
            <div class="detail-value">+${certificateData.improvementPercentage}%</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Sessions Completed</div>
            <div class="detail-value">${certificateData.totalSessionsCompleted}/8</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Completion Date</div>
            <div class="detail-value">${new Date(certificateData.completionDate).toLocaleDateString()}</div>
          </div>
        </div>
        
        <div class="signature-section">
          <div class="signature">
            <div class="signature-line"></div>
            <div>Coach ${certificateData.coachName}</div>
            <div style="font-size: 12px; color: #6b7280;">REBALL Coach</div>
          </div>
          <div class="signature">
            <div class="signature-line"></div>
            <div>Issued Date</div>
            <div style="font-size: 12px; color: #6b7280;">${new Date(certificateData.issuedDate).toLocaleDateString()}</div>
          </div>
        </div>
        
        <div class="certificate-id">
          Certificate ID: ${certificateData.certificateId}
        </div>
      </div>
    </body>
    </html>
  `;

  // In a real implementation, you would convert this HTML to PDF
  // For now, we'll return the HTML template
  return {
    html: htmlTemplate,
    certificateId: certificateData.certificateId
  };
} 