import api from './api';
import { ApiResponse } from '../lib/types';

export interface ChatParticipant {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  role: string;
  headline?: string;
}

export interface ChatMessage {
  _id: string;
  chat: string;
  sender: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    role: string;
  };
  text: string;
  createdAt: string;
}

export interface ChatRoom {
  _id: string;
  participants: ChatParticipant[];
  latestMessage?: {
    _id: string;
    sender: {
      firstName: string;
      lastName: string;
    };
    text: string;
  };
  updatedAt: string;
}

export const chatService = {
  createChat: async (recipientId: string): Promise<ApiResponse<ChatRoom>> => {
    const response = await api.post('/chats', { recipientId });
    return response.data;
  },

  getChats: async (): Promise<ApiResponse<ChatRoom[]>> => {
    const response = await api.get('/chats');
    return response.data;
  },

  sendMessage: async (chatId: string, text: string): Promise<ApiResponse<ChatMessage>> => {
    const response = await api.post('/messages', { chatId, text });
    return response.data;
  },

  getMessages: async (chatId: string): Promise<ApiResponse<ChatMessage[]>> => {
    const response = await api.get(`/messages/${chatId}`);
    return response.data;
  },
};
export default chatService;
