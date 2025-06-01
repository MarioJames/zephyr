'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from 'oidc-client-ts';
import { userManager } from '@/config/oidc';

// 定义OIDC状态接口
interface OIDCState {
  // 状态
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  accessToken: string | null;
  refreshToken: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  setTokens: (accessToken: string | null, refreshToken: string | null) => void;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  loadUser: () => Promise<void>;
  clearState: () => void;
}

// 创建Zustand store
export const useOIDCStore = create<OIDCState>()(
  persist(
    (set, get) => ({
      // 初始状态
      user: null,
      isLoading: true,
      error: null,
      accessToken: null,
      refreshToken: null,

      // Actions
      setUser: (user) => {
        set({ user });
        if (user) {
          set({
            accessToken: user.access_token || null,
            refreshToken: user.refresh_token || null,
          });
        } else {
          set({
            accessToken: null,
            refreshToken: null,
          });
        }
      },

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),

      login: async () => {
        if (!userManager) {
          set({ error: new Error('OIDC client not initialized') });
          return;
        }

        try {
          set({ isLoading: true, error: null });
          await userManager.signinRedirect();
        } catch (err) {
          set({
            error: err instanceof Error ? err : new Error('Login failed'),
            isLoading: false
          });
        }
      },

      logout: async () => {
        if (!userManager) {
          set({ error: new Error('OIDC client not initialized') });
          return;
        }

        try {
          set({ isLoading: true, error: null });
          await userManager.signoutRedirect();
        } catch (err) {
          set({
            error: err instanceof Error ? err : new Error('Logout failed'),
            isLoading: false
          });
        }
      },

      refreshAccessToken: async () => {
        const { user } = get();
        if (!userManager || !user) {
          set({ error: new Error('OIDC client not initialized or user not logged in') });
          return;
        }

        try {
          set({ isLoading: true, error: null });
          const newUser = await userManager.signinSilent();
          if (newUser) {
            get().setUser(newUser);
          }
        } catch (err) {
          set({
            error: err instanceof Error ? err : new Error('Token refresh failed')
          });
        } finally {
          set({ isLoading: false });
        }
      },

      loadUser: async () => {
        if (!userManager) {
          set({ isLoading: false });
          return;
        }

        try {
          set({ error: null });
          const user = await userManager.getUser();
          get().setUser(user);
        } catch (err) {
          set({ error: err instanceof Error ? err : new Error('Failed to load user') });
        } finally {
          set({ isLoading: false });
        }
      },

      clearState: () => set({
        user: null,
        isLoading: false,
        error: null,
        accessToken: null,
        refreshToken: null,
      }),
    }),
    {
      name: 'oidc-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),
      // 只持久化必要的状态，不持久化loading和error
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);

// 导出类型供其他文件使用
export type { OIDCState };
