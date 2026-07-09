import api from './api';
import { ApiResponse } from '../lib/types';

export interface EntrepreneurAnalyticsData {
  hasStartup: boolean;
  startupName?: string;
  slug?: string;
  stats: {
    views: number;
    followers: number;
    bookmarks: number;
    fundingRaised: number;
    fundingGoal: number;
    fundingProgress: number;
  };
  viewsOverTime: { name: string; views: number }[];
  industryBenchmarks: { subject: string; startupValue: number; averageValue: number }[];
  milestonesSummary: { completed: number; pending: number };
}

export interface InvestorAnalyticsData {
  stats: {
    bookmarksCount: number;
    followsCount: number;
    totalInvested: number;
    activeProposals: number;
    meetingsScheduled: number;
  };
  industryDistribution: { name: string; value: number }[];
  stageDistribution: { name: string; value: number }[];
  portfolioCompanies: {
    name: string;
    stage: string;
    investedAmount: number;
    equityOwned: number;
  }[];
}

export interface MentorAnalyticsData {
  averageRating: number;
  totalReviews: number;
  completedSessions: number;
  upcomingSessions: number;
  ratingDistribution: { star: string; count: number }[];
  growthData: { name: string; sessions: number }[];
}

export const analyticsService = {
  getEntrepreneurAnalytics: async (): Promise<ApiResponse<EntrepreneurAnalyticsData>> => {
    const { data } = await api.get('/analytics/entrepreneur');
    return data;
  },

  getInvestorAnalytics: async (): Promise<ApiResponse<InvestorAnalyticsData>> => {
    const { data } = await api.get('/analytics/investor');
    return data;
  },

  getMentorAnalytics: async (): Promise<ApiResponse<MentorAnalyticsData>> => {
    const { data } = await api.get('/analytics/mentor');
    return data;
  },
};
export default analyticsService;
