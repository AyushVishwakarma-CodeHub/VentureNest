import { create } from 'zustand';
import { Startup, ITraction, IMilestone } from '../lib/types';
import { startupService, GetStartupsParams } from '../services/startupService';

interface StartupState {
  startups: Startup[];
  activeStartup: Startup | null;
  myStartup: Startup | null;
  bookmarks: Startup[];
  isLoading: boolean;
  error: string | null;
  filters: GetStartupsParams;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  // Actions
  setFilters: (filters: Partial<GetStartupsParams>) => void;
  resetFilters: () => void;
  fetchStartups: () => Promise<void>;
  fetchStartupBySlug: (slug: string) => Promise<void>;
  fetchMyStartup: () => Promise<void>;
  createStartup: (data: Partial<Startup>) => Promise<Startup>;
  updateStartup: (id: string, data: Partial<Startup>) => Promise<Startup>;
  deleteStartup: (id: string) => Promise<void>;
  uploadLogo: (id: string, file: File) => Promise<void>;
  uploadPitchDeck: (id: string, file: File) => Promise<void>;
  uploadVideo: (id: string, file: File) => Promise<void>;
  addTraction: (id: string, metric: ITraction) => Promise<void>;
  addMilestone: (id: string, milestone: IMilestone) => Promise<void>;
  toggleBookmark: (startup: Startup) => Promise<void>;
  toggleFollow: (startup: Startup) => Promise<void>;
  fetchBookmarks: () => Promise<void>;
}

const initialFilters: GetStartupsParams = {
  search: '',
  stage: '',
  industry: '',
  location: '',
  minFunding: undefined,
  maxFunding: undefined,
  sort: 'newest',
  page: 1,
  limit: 9,
};

export const useStartupStore = create<StartupState>((set, get) => ({
  startups: [],
  activeStartup: null,
  myStartup: null,
  bookmarks: [],
  isLoading: false,
  error: null,
  filters: initialFilters,
  pagination: {
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 0,
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters, page: newFilters.page !== undefined ? newFilters.page : 1 },
    }));
  },

  resetFilters: () => {
    set({ filters: initialFilters });
  },

  fetchStartups: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await startupService.getStartups(get().filters);
      set({
        startups: response.data,
        pagination: {
          page: response.pagination.page,
          limit: response.pagination.limit,
          total: response.pagination.total,
          totalPages: response.pagination.pages,
        },
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to load startups', isLoading: false });
    }
  },

  fetchStartupBySlug: async (slug) => {
    set({ isLoading: true, error: null });
    try {
      const response = await startupService.getStartupBySlug(slug);
      set({ activeStartup: response.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to load startup details', isLoading: false });
    }
  },

  fetchMyStartup: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await startupService.getMyStartup();
      set({ myStartup: response.data, isLoading: false });
    } catch (err: any) {
      // Don't set error state if they simply haven't created one yet
      set({ myStartup: null, isLoading: false });
    }
  },

  createStartup: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await startupService.createStartup(data);
      set({ myStartup: response.data, isLoading: false });
      return response.data;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Failed to create startup';
      set({ error: errMsg, isLoading: false });
      throw new Error(errMsg);
    }
  },

  updateStartup: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await startupService.updateStartup(id, data);
      set({ myStartup: response.data, isLoading: false });
      if (get().activeStartup?._id === id) {
        set({ activeStartup: response.data });
      }
      return response.data;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Failed to update startup';
      set({ error: errMsg, isLoading: false });
      throw new Error(errMsg);
    }
  },

  deleteStartup: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await startupService.deleteStartup(id);
      set({ myStartup: null, isLoading: false });
      if (get().activeStartup?._id === id) {
        set({ activeStartup: null });
      }
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to delete startup', isLoading: false });
      throw err;
    }
  },

  uploadLogo: async (id, file) => {
    try {
      const res = await startupService.uploadLogo(id, file);
      set((state) => {
        const update = { logo: res.data.logoUrl };
        const mySt = state.myStartup ? { ...state.myStartup, ...update } : null;
        const actSt = state.activeStartup ? { ...state.activeStartup, ...update } : null;
        return { myStartup: mySt, activeStartup: actSt };
      });
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to upload logo');
    }
  },

  uploadPitchDeck: async (id, file) => {
    try {
      const res = await startupService.uploadPitchDeck(id, file);
      set((state) => {
        const update = { pitchDeck: res.data.pitchDeckUrl };
        const mySt = state.myStartup ? { ...state.myStartup, ...update } : null;
        const actSt = state.activeStartup ? { ...state.activeStartup, ...update } : null;
        return { myStartup: mySt, activeStartup: actSt };
      });
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to upload pitch deck');
    }
  },

  uploadVideo: async (id, file) => {
    try {
      const res = await startupService.uploadVideo(id, file);
      set((state) => {
        const update = { videoDemo: res.data.videoDemoUrl };
        const mySt = state.myStartup ? { ...state.myStartup, ...update } : null;
        const actSt = state.activeStartup ? { ...state.activeStartup, ...update } : null;
        return { myStartup: mySt, activeStartup: actSt };
      });
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to upload video');
    }
  },

  addTraction: async (id, metric) => {
    try {
      const res = await startupService.addTraction(id, metric);
      set((state) => {
        const mySt = state.myStartup ? { ...state.myStartup, traction: res.data } : null;
        const actSt = state.activeStartup ? { ...state.activeStartup, traction: res.data } : null;
        return { myStartup: mySt, activeStartup: actSt };
      });
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to add traction metric');
    }
  },

  addMilestone: async (id, milestone) => {
    try {
      const res = await startupService.addMilestone(id, milestone);
      set((state) => {
        const mySt = state.myStartup ? { ...state.myStartup, milestones: res.data } : null;
        const actSt = state.activeStartup ? { ...state.activeStartup, milestones: res.data } : null;
        return { myStartup: mySt, activeStartup: actSt };
      });
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to add milestone');
    }
  },

  toggleBookmark: async (startup) => {
    const isBookmarked = startup.isBookmarked;
    // Optimistic Update
    set((state) => {
      const updated = state.startups.map((s) =>
        s._id === startup._id
          ? {
              ...s,
              isBookmarked: !isBookmarked,
              bookmarksCount: s.bookmarksCount + (isBookmarked ? -1 : 1),
            }
          : s
      );
      const active =
        state.activeStartup?._id === startup._id
          ? {
              ...state.activeStartup,
              isBookmarked: !isBookmarked,
              bookmarksCount: state.activeStartup.bookmarksCount + (isBookmarked ? -1 : 1),
            }
          : state.activeStartup;

      return { startups: updated, activeStartup: active };
    });

    try {
      if (isBookmarked) {
        await startupService.unbookmarkStartup(startup._id);
      } else {
        await startupService.bookmarkStartup(startup._id);
      }
    } catch (err) {
      // Revert if error
      set((state) => {
        const updated = state.startups.map((s) =>
          s._id === startup._id ? { ...s, isBookmarked, bookmarksCount: startup.bookmarksCount } : s
        );
        const active =
          state.activeStartup?._id === startup._id
            ? { ...state.activeStartup, isBookmarked, bookmarksCount: startup.bookmarksCount }
            : state.activeStartup;

        return { startups: updated, activeStartup: active };
      });
    }
  },

  toggleFollow: async (startup) => {
    const isFollowing = startup.isFollowing;
    // Optimistic Update
    set((state) => {
      const updated = state.startups.map((s) =>
        s._id === startup._id
          ? {
              ...s,
              isFollowing: !isFollowing,
              followersCount: s.followersCount + (isFollowing ? -1 : 1),
            }
          : s
      );
      const active =
        state.activeStartup?._id === startup._id
          ? {
              ...state.activeStartup,
              isFollowing: !isFollowing,
              followersCount: state.activeStartup.followersCount + (isFollowing ? -1 : 1),
            }
          : state.activeStartup;

      return { startups: updated, activeStartup: active };
    });

    try {
      if (isFollowing) {
        await startupService.unfollowStartup(startup._id);
      } else {
        await startupService.followStartup(startup._id);
      }
    } catch (err) {
      // Revert
      set((state) => {
        const updated = state.startups.map((s) =>
          s._id === startup._id ? { ...s, isFollowing, followersCount: startup.followersCount } : s
        );
        const active =
          state.activeStartup?._id === startup._id
            ? { ...state.activeStartup, isFollowing, followersCount: startup.followersCount }
            : state.activeStartup;

        return { startups: updated, activeStartup: active };
      });
    }
  },

  fetchBookmarks: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await startupService.getBookmarks();
      set({ bookmarks: res.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch bookmarks', isLoading: false });
    }
  },
}));
