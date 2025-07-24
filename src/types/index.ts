// REBALL Football Training Platform Types

export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  profile?: Profile;
}

export interface Profile {
  id: string;
  userId: string;
  playerName?: string;
  dateOfBirth?: Date;
  position?: FootballPosition;
  playingLevel?: PlayingLevel;
  currentTeam?: string;
  contactEmail?: string;
  contactNumber?: string;
  postcode?: string;
  guardianName?: string;
  medicalConditions?: string;
  trainingReason?: string;
  hearAbout?: HearAboutSource;
  referralName?: string;
  postTrainingSnacks?: string;
  postTrainingDrinks?: string;
  socialMediaConsent: boolean;
  marketingConsent: boolean;
  evidenceFiles: string[];
  welcomeCompleted: boolean;
  welcomeCompletedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  id: string;
  name: string;
  description?: string;
  position: FootballPosition;
  type?: string;
  durationWeeks: number;
  price121?: number;
  priceGroup?: number;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: string;
  userId: string;
  courseId: string;
  trainingType: TrainingType;
  packageType: PackageType;
  totalPrice: number;
  status: BookingStatus;
  availability?: any;
  consultationAvailability?: any;
  courseQuestions?: any;
  googleCalendarConnected: boolean;
  bookingDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Progress {
  id: string;
  userId: string;
  courseId: string;
  scenario: string;
  confidenceBefore?: number;
  confidenceAfter?: number;
  sessionNumber?: number;
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Video {
  id: string;
  userId: string;
  bookingId?: string;
  title: string;
  type: VideoType;
  url: string;
  thumbnail?: string;
  duration?: number;
  sessionNumber?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  certificateUrl?: string;
  issuedDate: Date;
  createdAt: Date;
}

// Enums
export type FootballPosition =
  | 'full-back'
  | 'centre-back'
  | 'central-defensive-midfielder'
  | 'central-midfielder'
  | 'central-attacking-midfielder'
  | 'left-winger'
  | 'right-winger'
  | 'striker';

export type PlayingLevel =
  | 'grassroots-club'
  | 'semi-professional-club'
  | 'professional-club';

export type HearAboutSource =
  | 'social-media'
  | 'coach-referral'
  | 'player-referral'
  | 'club-partnership'
  | 'other';

export type TrainingType = '121' | 'group';

export type PackageType =
  | 'training-only'
  | 'training-sisw'
  | 'training-sisw-tav';

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled';

export type VideoType =
  | 'sisw'
  | 'tav'
  | 'highlight'
  | 'training';

// Form Types
export interface WelcomeFormData {
  playerName: string;
  dateOfBirth: string;
  parentGuardianName?: string;
  contactEmail: string;
  contactNumber: string;
  postcode: string;
  medicalConditions?: string;
  position: FootballPosition;
  playingLevel: PlayingLevel;
  currentTeam?: string;
  trainingReason: string;
  hearAbout: HearAboutSource;
  referralName?: string;
  otherSource?: string;
  postTrainingSnacks: string;
  postTrainingDrinks: string;
  socialMediaConsent: boolean;
  marketingConsent: boolean;
  evidenceUpload?: File[];
}

// Dashboard Types
export interface DashboardData {
  user: User & { profile: Profile };
  upcomingSessions: Booking[];
  completedSessions: Booking[];
  progressTracking: ProgressMetrics;
  availableBookings: Course[];
  videoLibrary: Video[];
  certificates: Certificate[];
}

export interface ProgressMetrics {
  confidenceRatings: {
    scenario: string;
    beforeRating: number;
    afterRating: number;
    sessionsCompleted: number;
  }[];
  coursesCompleted: Course[];
  totalSessions: number;
  averageImprovement: number;
  masteredScenarios: string[];
}

// Pricing Types
export interface PricingPackage {
  type: TrainingType;
  packages: {
    name: string;
    price: number;
    features: string[];
  }[];
}

// Course Questions Types
export interface CourseQuestions {
  'striker-finishing': string[];
  'striker-keeper': string[];
  'winger-finishing': string[];
  'winger-crossing': string[];
  'cam-finishing': string[];
  'cam-crossing': string[];
  'fullback-crossing': string[];
} 