import api from './api';
import { ApiResponse } from '../lib/types';

export interface Meeting {
  _id: string;
  host: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    role: string;
  };
  attendee: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    role: string;
  };
  title: string;
  description?: string;
  date: string;
  duration: number;
  status: 'scheduled' | 'cancelled' | 'completed';
  videoLink?: string;
  createdAt: string;
}

export const meetingService = {
  scheduleMeeting: async (data: {
    attendeeId: string;
    title: string;
    description?: string;
    date: string;
    duration: number;
  }): Promise<ApiResponse<Meeting>> => {
    const response = await api.post('/meetings', data);
    return response.data;
  },

  getMeetings: async (): Promise<ApiResponse<Meeting[]>> => {
    const response = await api.get('/meetings');
    return response.data;
  },

  updateMeetingStatus: async (
    id: string,
    status: 'completed' | 'cancelled'
  ): Promise<ApiResponse<Meeting>> => {
    const response = await api.put(`/meetings/${id}/status`, { status });
    return response.data;
  },
};
export default meetingService;
