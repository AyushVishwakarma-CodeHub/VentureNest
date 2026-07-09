import api from './api';
import { ApiResponse } from '../lib/types';

export interface InvestmentProposal {
  _id: string;
  investor: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
  startup: {
    _id: string;
    name: string;
    slug: string;
    logo?: string;
    industry: string[];
  };
  amount: number;
  equityOffered: number;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  timeline: {
    status: string;
    comment?: string;
    date: string;
  }[];
  createdAt: string;
}

export const investmentService = {
  submitProposal: async (data: {
    startupId: string;
    amount: number;
    equityOffered: number;
    message?: string;
  }): Promise<ApiResponse<InvestmentProposal>> => {
    const response = await api.post('/investments', data);
    return response.data;
  },

  getProposals: async (): Promise<ApiResponse<InvestmentProposal[]>> => {
    const response = await api.get('/investments');
    return response.data;
  },

  updateProposalStatus: async (
    id: string,
    status: 'accepted' | 'rejected' | 'withdrawn',
    comment?: string
  ): Promise<ApiResponse<InvestmentProposal>> => {
    const response = await api.put(`/investments/${id}/status`, { status, comment });
    return response.data;
  },
};
export default investmentService;
