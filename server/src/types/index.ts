/**
 * Custom TypeScript type declarations for Startup Pitch Hub.
 * Centralizes all shared interfaces, types, and Express augmentations.
 */

import { Document, Types } from "mongoose";

// ─── User Role Enum ──────────────────────────────────────────────────────────

export enum UserRole {
  ENTREPRENEUR = "entrepreneur",
  INVESTOR = "investor",
  MENTOR = "mentor",
  ADMIN = "admin",
}

// ─── Social Links ────────────────────────────────────────────────────────────

export interface ISocialLinks {
  linkedin?: string;
  twitter?: string;
  github?: string;
  facebook?: string;
}

// ─── Experience & Education ──────────────────────────────────────────────────

export interface IExperience {
  title: string;
  company: string;
  location?: string;
  from: Date;
  to?: Date;
  current: boolean;
  description?: string;
}

export interface IEducation {
  school: string;
  degree: string;
  fieldOfStudy: string;
  from: Date;
  to?: Date;
  current: boolean;
  description?: string;
}

// ─── User Interface ─────────────────────────────────────────────────────────

export interface IUser extends Document {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  avatar?: string;
  isVerified: boolean;
  isActive: boolean;
  verificationToken?: string;
  verificationExpiry?: Date;
  resetPasswordToken?: string;
  resetPasswordExpiry?: Date;
  refreshToken?: string;
  googleId?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// ─── Profile Interface ──────────────────────────────────────────────────────

export interface IProfile extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId | IUser;
  bio?: string;
  headline?: string;
  location?: string;
  website?: string;
  phone?: string;
  social: ISocialLinks;
  skills: string[];
  interests: string[];
  experience: IExperience[];
  education: IEducation[];
  company?: string;
  position?: string;
  industry?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Startup Interface ──────────────────────────────────────────────────────

export enum StartupStage {
  IDEA = "Idea",
  MVP = "MVP",
  PRE_SEED = "Pre-Seed",
  SEED = "Seed",
  SERIES_A = "Series A",
  SERIES_B = "Series B",
  SERIES_C = "Series C+",
  GROWTH = "Growth",
}

export interface ITraction {
  metricName: string;
  metricValue: string;
  date: Date;
}

export interface IMilestone {
  title: string;
  description?: string;
  date: Date;
  completed: boolean;
}

export interface IStartup extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  logo?: string;
  headline: string;
  description: string;
  founder: Types.ObjectId | IUser;
  cofounders: (Types.ObjectId | IUser)[];
  industry: string[];
  stage: StartupStage;
  location: string;
  website?: string;
  pitchDeck?: string; // URL
  videoDemo?: string; // URL
  teamSize: number;
  launchDate?: Date;
  fundingRaised: number;
  fundingGoal: number;
  equityOffered?: number;
  valuation?: number;
  minInvestment?: number;
  revenueModel?: string;
  monthlyRecurringRevenue?: number;
  traction: ITraction[];
  socials: ISocialLinks;
  milestones: IMilestone[];
  isVerified: boolean;
  isFeatured: boolean;
  views: number;
  followersCount: number;
  bookmarksCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Bookmark Interface ─────────────────────────────────────────────────────

export interface IBookmark extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId | IUser;
  startup: Types.ObjectId | IStartup;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Follow Interface ───────────────────────────────────────────────────────

export interface IFollow extends Document {
  _id: Types.ObjectId;
  follower: Types.ObjectId | IUser;
  followingType: "user" | "startup";
  followingUser?: Types.ObjectId | IUser;
  followingStartup?: Types.ObjectId | IStartup;
  createdAt: Date;
  updatedAt: Date;
}

// ─── JWT Auth Payload ────────────────────────────────────────────────────────

export interface AuthPayload {
  userId: string;
  email: string;
  role: UserRole;
}

// ─── API Response Types ─────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: Partial<IUser>;
    accessToken: string;
  };
}

// ─── Express Request Augmentation ────────────────────────────────────────────

declare global {
  namespace Express {
    interface Request {
      /** Authenticated user attached by the auth middleware */
      user?: IUser;
    }
  }
}
