import { create } from 'zustand';
import type { User } from '@/lib/types';
import authService, {
  type LoginPayload,
  type RegisterPayload,
} from '@/services/authService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  refreshToken: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,

  login: async (payload: LoginPayload) => {
    set({ isLoading: true });
    try {
      const response = await authService.login(payload);
      const { user, accessToken } = response.data;
      localStorage.setItem('accessToken', accessToken);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (payload: RegisterPayload) => {
    set({ isLoading: true });
    try {
      await authService.register(payload);
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch {
      // Proceed with local cleanup even if server call fails
    } finally {
      localStorage.removeItem('accessToken');
      set({ user: null, isAuthenticated: false });
    }
  },

  setUser: (user: User | null) => {
    set({ user, isAuthenticated: !!user });
  },

  refreshToken: async () => {
    try {
      const response = await authService.refreshToken();
      localStorage.setItem('accessToken', response.data.accessToken);
    } catch {
      get().logout();
    }
  },

  initialize: async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      set({ isInitialized: true });
      return;
    }

    try {
      const response = await authService.getMe();
      set({
        user: response.data,
        isAuthenticated: true,
        isInitialized: true,
      });
    } catch (error) {
      localStorage.removeItem('accessToken');
      set({ isInitialized: true });
    }
  },
}));
