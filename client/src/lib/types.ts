// ─── User & Auth ──────────────────────────────────────────────
export enum UserRole {
  ENTREPRENEUR = 'entrepreneur',
  INVESTOR = 'investor',
  MENTOR = 'mentor',
  ADMIN = 'admin',
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  avatar?: string;
  isVerified: boolean;
  isActive: boolean;
  isOnboarded: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  _id: string;
  user: string | User;
  bio?: string;
  headline?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  phone?: string;
  skills: string[];
  interests: string[];
  experience: ExperienceItem[];
  education: EducationItem[];
}

export interface ExperienceItem {
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface EducationItem {
  school: string;
  degree: string;
  field: string;
  year: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// ─── Startup ──────────────────────────────────────────────────
export type FundingStage =
  | 'Idea'
  | 'MVP'
  | 'Pre-Seed'
  | 'Seed'
  | 'Series A'
  | 'Series B'
  | 'Series C+'
  | 'Growth';

export interface ITraction {
  metricName: string;
  metricValue: string;
  date: string;
}

export interface IMilestone {
  title: string;
  description?: string;
  date: string;
  completed: boolean;
}

export interface Startup {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
  headline: string;
  description: string;
  founder: string | User;
  cofounders: (string | User)[];
  industry: string[];
  stage: FundingStage;
  location: string;
  website?: string;
  pitchDeck?: string;
  videoDemo?: string;
  teamSize: number;
  launchDate?: string;
  fundingRaised: number;
  fundingGoal: number;
  equityOffered?: number;
  valuation?: number;
  minInvestment?: number;
  revenueModel?: string;
  monthlyRecurringRevenue?: number;
  traction: ITraction[];
  socials: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    facebook?: string;
  };
  milestones: IMilestone[];
  isVerified: boolean;
  isFeatured: boolean;
  views: number;
  followersCount: number;
  bookmarksCount: number;
  isBookmarked?: boolean;
  isFollowing?: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Investment ───────────────────────────────────────────────
export type InvestmentStatus =
  | 'interested'
  | 'due-diligence'
  | 'negotiation'
  | 'committed'
  | 'completed'
  | 'declined';

export interface Investment {
  _id: string;
  investor: string | User;
  startup: string | Startup;
  amount: number;
  equity?: number;
  status: InvestmentStatus;
  notes?: string;
  terms?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Meeting ──────────────────────────────────────────────────
export type MeetingStatus = 'scheduled' | 'completed' | 'cancelled' | 'no-show';

export interface Meeting {
  _id: string;
  title: string;
  description?: string;
  organizer: string | User;
  participants: string[] | User[];
  startTime: string;
  endTime: string;
  status: MeetingStatus;
  meetingLink?: string;
  agenda?: string;
  notes?: string;
  createdAt: string;
}

// ─── Review ───────────────────────────────────────────────────
export interface Review {
  _id: string;
  reviewer: string | User;
  startup: string | Startup;
  rating: number;
  comment: string;
  aspects: {
    team: number;
    product: number;
    market: number;
    traction: number;
    financials: number;
  };
  createdAt: string;
}

// ─── Notification ─────────────────────────────────────────────
export type NotificationType =
  | 'investment'
  | 'meeting'
  | 'message'
  | 'review'
  | 'competition'
  | 'system';

export interface Notification {
  _id: string;
  user: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
}

// ─── Messaging ────────────────────────────────────────────────
export interface Conversation {
  _id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}

export interface Message {
  _id: string;
  conversation: string;
  sender: string | User;
  content: string;
  attachments?: Attachment[];
  readBy: string[];
  createdAt: string;
}

export interface Attachment {
  name: string;
  url: string;
  type: string;
  size: number;
}

// ─── Feed ─────────────────────────────────────────────────────
export interface Post {
  _id: string;
  author: string | User;
  content: string;
  images?: string[];
  likes: string[];
  comments: Comment[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  author: string | User;
  content: string;
  likes: string[];
  createdAt: string;
}

// ─── Competition ──────────────────────────────────────────────
export type CompetitionStatus = 'upcoming' | 'open' | 'judging' | 'completed';

export interface Competition {
  _id: string;
  title: string;
  description: string;
  rules: string;
  prizes: Prize[];
  startDate: string;
  endDate: string;
  submissionDeadline: string;
  status: CompetitionStatus;
  participants: string[] | Startup[];
  judges: string[] | User[];
  maxParticipants?: number;
  createdAt: string;
}

export interface Prize {
  place: number;
  title: string;
  amount: number;
  description?: string;
}

// ─── Event ────────────────────────────────────────────────────
export type EventType = 'webinar' | 'workshop' | 'networking' | 'demo-day' | 'conference';

export interface Event {
  _id: string;
  title: string;
  description: string;
  type: EventType;
  startDate: string;
  endDate: string;
  location: string;
  isVirtual: boolean;
  meetingLink?: string;
  organizer: string | User;
  attendees: string[] | User[];
  maxAttendees?: number;
  coverImage?: string;
  tags: string[];
  createdAt: string;
}

// ─── API Response Types ───────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}
