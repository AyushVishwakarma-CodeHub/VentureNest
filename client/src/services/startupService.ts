import api from './api';
import { Startup, ApiResponse, PaginatedResponse, ITraction, IMilestone } from '../lib/types';

export interface GetStartupsParams {
  search?: string;
  stage?: string;
  industry?: string | string[];
  location?: string;
  minFunding?: number;
  maxFunding?: number;
  sort?: string;
  page?: number;
  limit?: number;
}

export const startupService = {
  getStartups: async (params?: GetStartupsParams): Promise<PaginatedResponse<Startup>> => {
    const { data } = await api.get('/startups', { params });
    return data;
  },

  getStartupBySlug: async (slug: string): Promise<ApiResponse<Startup>> => {
    const { data } = await api.get(`/startups/s/${slug}`);
    return data;
  },

  getMyStartup: async (): Promise<ApiResponse<Startup>> => {
    const { data } = await api.get('/startups/my');
    return data;
  },

  createStartup: async (startupData: Partial<Startup>): Promise<ApiResponse<Startup>> => {
    const { data } = await api.post('/startups', startupData);
    return data;
  },

  updateStartup: async (id: string, startupData: Partial<Startup>): Promise<ApiResponse<Startup>> => {
    const { data } = await api.put(`/startups/${id}`, startupData);
    return data;
  },

  deleteStartup: async (id: string): Promise<ApiResponse<void>> => {
    const { data } = await api.delete(`/startups/${id}`);
    return data;
  },

  uploadLogo: async (id: string, file: File): Promise<ApiResponse<{ logoUrl: string }>> => {
    const formData = new FormData();
    formData.append('logo', file);
    const { data } = await api.post(`/startups/${id}/logo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  uploadPitchDeck: async (id: string, file: File): Promise<ApiResponse<{ pitchDeckUrl: string }>> => {
    const formData = new FormData();
    formData.append('pitchDeck', file);
    const { data } = await api.post(`/startups/${id}/pitch-deck`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  uploadVideo: async (id: string, file: File): Promise<ApiResponse<{ videoDemoUrl: string }>> => {
    const formData = new FormData();
    formData.append('videoDemo', file);
    const { data } = await api.post(`/startups/${id}/video`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  // Traction and Roadmap
  addTraction: async (id: string, traction: ITraction): Promise<ApiResponse<ITraction[]>> => {
    const { data } = await api.post(`/startups/${id}/traction`, traction);
    return data;
  },

  addMilestone: async (id: string, milestone: IMilestone): Promise<ApiResponse<IMilestone[]>> => {
    const { data } = await api.post(`/startups/${id}/milestone`, milestone);
    return data;
  },

  // Social interactions
  bookmarkStartup: async (id: string): Promise<ApiResponse<void>> => {
    const { data } = await api.post(`/social/bookmarks/${id}`);
    return data;
  },

  unbookmarkStartup: async (id: string): Promise<ApiResponse<void>> => {
    const { data } = await api.delete(`/social/bookmarks/${id}`);
    return data;
  },

  getBookmarks: async (): Promise<ApiResponse<Startup[]>> => {
    const { data } = await api.get('/social/bookmarks');
    return data;
  },

  followStartup: async (id: string): Promise<ApiResponse<void>> => {
    const { data } = await api.post(`/social/follows/startup/${id}`);
    return data;
  },

  unfollowStartup: async (id: string): Promise<ApiResponse<void>> => {
    const { data } = await api.delete(`/social/follows/startup/${id}`);
    return data;
  },
};
