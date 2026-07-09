import api from './api';
import { ApiResponse, Notification } from '../lib/types';

export interface NotificationResponse {
  notifications: Notification[];
  unreadCount: number;
}

export const notificationService = {
  getNotifications: async (): Promise<ApiResponse<NotificationResponse>> => {
    const { data } = await api.get('/notifications');
    return data;
  },

  markAsRead: async (id: string): Promise<ApiResponse<Notification>> => {
    const { data } = await api.put(`/notifications/${id}/read`);
    return data;
  },

  markAllAsRead: async (): Promise<ApiResponse<void>> => {
    const { data } = await api.put('/notifications/read-all');
    return data;
  },

  deleteNotification: async (id: string): Promise<ApiResponse<void>> => {
    const { data } = await api.delete(`/notifications/${id}`);
    return data;
  },
};
export default notificationService;
