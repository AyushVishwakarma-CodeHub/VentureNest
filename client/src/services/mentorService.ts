import api from './api';
import { ApiResponse } from '../lib/types';

export interface Mentor {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  headline?: string;
  bio?: string;
  interests?: string[];
}

export interface MentorSession {
  _id: string;
  mentor: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    headline?: string;
  };
  entrepreneur: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
  startup?: {
    _id: string;
    name: string;
    slug: string;
  };
  topic: string;
  status: 'requested' | 'accepted' | 'rejected' | 'completed';
  scheduledAt?: string;
  duration: number;
  notes?: string;
  createdAt: string;
}

export interface MentorReview {
  _id: string;
  reviewer: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
  reviewee: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export const mentorService = {
  listMentors: async (): Promise<ApiResponse<Mentor[]>> => {
    const response = await api.get('/mentors/list');
    return response.data;
  },

  requestSession: async (data: {
    mentorId: string;
    startupId?: string;
    topic: string;
    duration: number;
    scheduledAt: string;
  }): Promise<ApiResponse<MentorSession>> => {
    const response = await api.post('/mentors/sessions', data);
    return response.data;
  },

  getSessions: async (): Promise<ApiResponse<MentorSession[]>> => {
    const response = await api.get('/mentors/sessions');
    return response.data;
  },

  updateSessionStatus: async (
    id: string,
    status: 'accepted' | 'rejected' | 'completed',
    notes?: string
  ): Promise<ApiResponse<MentorSession>> => {
    const response = await api.put(`/mentors/sessions/${id}/status`, { status, notes });
    return response.data;
  },

  submitReview: async (data: {
    mentorId: string;
    rating: number;
    comment: string;
  }): Promise<ApiResponse<MentorReview>> => {
    const response = await api.post('/reviews', data);
    return response.data;
  },

  getReviews: async (mentorId: string): Promise<ApiResponse<MentorReview[]>> => {
    const response = await api.get(`/reviews/mentor/${mentorId}`);
    return response.data;
  },
};
export default mentorService;
