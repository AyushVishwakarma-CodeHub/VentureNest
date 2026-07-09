import api from './api';
import { ApiResponse } from '../lib/types';

export interface InvestorMatch {
  investor: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
  matchScore: number;
  matchingSectors: string[];
  headline: string;
}

export interface AiFeedback {
  readinessScore: number;
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  recommendation: string;
}

export const aiService = {
  getInvestorMatches: async (startupId: string): Promise<ApiResponse<InvestorMatch[]>> => {
    const response = await api.get(`/ai/startup/${startupId}/matches`);
    return response.data;
  },

  getAiFeedback: async (startupId: string): Promise<ApiResponse<AiFeedback>> => {
    const response = await api.get(`/ai/startup/${startupId}/feedback`);
    return response.data;
  },
};
export default aiService;
