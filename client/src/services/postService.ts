import api from './api';
import { ApiResponse } from '../lib/types';

export interface FeedPost {
  _id: string;
  author: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    role: string;
    headline?: string;
  };
  content: string;
  likesCount: number;
  commentsCount: number;
  isLiked?: boolean;
  createdAt: string;
}

export interface PostComment {
  _id: string;
  post: string;
  author: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    role: string;
    headline?: string;
  };
  content: string;
  createdAt: string;
}

export const postService = {
  createPost: async (content: string): Promise<ApiResponse<FeedPost>> => {
    const response = await api.post('/posts', { content });
    return response.data;
  },

  getPosts: async (): Promise<ApiResponse<FeedPost[]>> => {
    const response = await api.get('/posts');
    return response.data;
  },

  likePost: async (postId: string): Promise<ApiResponse<{ isLiked: boolean }>> => {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
  },

  addComment: async (postId: string, content: string): Promise<ApiResponse<PostComment>> => {
    const response = await api.post('/comments', { postId, content });
    return response.data;
  },

  getComments: async (postId: string): Promise<ApiResponse<PostComment[]>> => {
    const response = await api.get(`/comments/post/${postId}`);
    return response.data;
  },
};
export default postService;
