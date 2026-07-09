import api from './api';
import { ApiResponse } from '../lib/types';

export interface Competition {
  _id: string;
  title: string;
  description: string;
  rules: string;
  prizePool: number;
  startDate: string;
  endDate: string;
  organizer: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  participantsCount: number;
  status: 'upcoming' | 'active' | 'completed';
  createdAt: string;
}

export interface CompetitionSubmission {
  _id: string;
  competition: string;
  startup: {
    _id: string;
    name: string;
    slug: string;
    logo?: string;
    tagline?: string;
    industry: string[];
  };
  pitchDeckUrl?: string;
  videoDemoUrl?: string;
  description?: string;
  status: 'pending' | 'approved' | 'rejected';
  score: number;
  createdAt: string;
}

export const competitionService = {
  createCompetition: async (data: {
    title: string;
    description: string;
    rules: string;
    prizePool: number;
    startDate: string;
    endDate: string;
  }): Promise<ApiResponse<Competition>> => {
    const response = await api.post('/competitions', data);
    return response.data;
  },

  listCompetitions: async (): Promise<ApiResponse<Competition[]>> => {
    const response = await api.get('/competitions/list');
    return response.data;
  },

  getCompetition: async (id: string): Promise<ApiResponse<Competition>> => {
    const response = await api.get(`/competitions/${id}`);
    return response.data;
  },

  submitEntry: async (data: {
    competitionId: string;
    startupId: string;
    pitchDeckUrl?: string;
    videoDemoUrl?: string;
    description?: string;
  }): Promise<ApiResponse<CompetitionSubmission>> => {
    const response = await api.post('/competitions/submit', data);
    return response.data;
  },

  getSubmissions: async (competitionId: string): Promise<ApiResponse<CompetitionSubmission[]>> => {
    const response = await api.get(`/competitions/${competitionId}/submissions`);
    return response.data;
  },

  voteSubmission: async (
    submissionId: string,
    score: number,
    comment?: string
  ): Promise<ApiResponse<{ score: number }>> => {
    const response = await api.post(`/competitions/submissions/${submissionId}/vote`, { score, comment });
    return response.data;
  },
};
export default competitionService;
