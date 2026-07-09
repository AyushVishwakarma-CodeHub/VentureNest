import api from './api';
import { API_ENDPOINTS } from '@/lib/constants';
import type { ApiResponse, AuthTokens, User } from '@/lib/types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'entrepreneur' | 'investor' | 'mentor';
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

const authService = {
  async login(payload: LoginPayload): Promise<ApiResponse<{ user: User; accessToken: string }>> {
    const { data } = await api.post(API_ENDPOINTS.AUTH.LOGIN, payload);
    return data;
  },

  async register(
    payload: RegisterPayload
  ): Promise<ApiResponse<{ user: User }>> {
    const { data } = await api.post(API_ENDPOINTS.AUTH.REGISTER, payload);
    return data;
  },

  async logout(): Promise<void> {
    await api.post(API_ENDPOINTS.AUTH.LOGOUT);
  },

  async refreshToken(): Promise<ApiResponse<{ accessToken: string }>> {
    const { data } = await api.post(API_ENDPOINTS.AUTH.REFRESH);
    return data;
  },

  async verifyEmail(token: string): Promise<ApiResponse<{ message: string }>> {
    const { data } = await api.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token });
    return data;
  },

  async forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    const { data } = await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    return data;
  },

  async resetPassword(
    payload: ResetPasswordPayload
  ): Promise<ApiResponse<{ message: string }>> {
    const { data } = await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, payload);
    return data;
  },

  async googleAuth(
    credential: string
  ): Promise<ApiResponse<{ user: User; tokens: AuthTokens }>> {
    const { data } = await api.post(API_ENDPOINTS.AUTH.GOOGLE, { credential });
    return data;
  },

  async getMe(): Promise<ApiResponse<User>> {
    const { data } = await api.get(API_ENDPOINTS.AUTH.ME);
    return data;
  },
};

export default authService;
