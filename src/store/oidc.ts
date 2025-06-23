'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from 'oidc-client-ts';
import { userManager } from '@/config/oidc';
import API, { UserItem } from '@/app/oneapi/user';

// Token 信息接口
export interface TokenInfo {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  tokenType: string;
  expiresAt: number; // Unix 时间戳
  scopes: string[];
}

// 定义OIDC状态接口
interface OIDCState {
  // 状态
  user: User | null;
  userInfo: UserItem | null; // 统一的用户信息
  isLoadingUserInfo: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
  tokenInfo: TokenInfo | null;

  // Token 自动刷新相关
  isRefreshing: boolean;
  lastRefreshTime: number | null;
  refreshTimer: NodeJS.Timeout | null;

  // Actions
  setUser: (user: User | null) => void;
  setUserInfo: (userInfo: UserItem | null) => void;
  setLoading: (loading: boolean) => void;
  setLoadingUserInfo: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  setTokenInfo: (tokenInfo: TokenInfo | null) => void;
  setIsRefreshing: (isRefreshing: boolean) => void;

  // 认证相关方法
  login: () => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  loadUserInfo: () => Promise<void>; // 加载用户信息
  clearState: () => void;

  // Token 管理方法
  refreshTokens: () => Promise<boolean>;
  scheduleTokenRefresh: () => void;
  clearRefreshTimer: () => void;
  isTokenExpired: () => boolean;
  isTokenExpiringSoon: (thresholdSeconds?: number) => boolean;
  getValidAccessToken: () => Promise<string | null>;
}

// 工具函数：从 User 对象中提取 Token 信息
const extractTokenInfo = (user: User): TokenInfo | null => {
  if (!user.access_token) return null;

  return {
    accessToken: user.access_token,
    refreshToken: user.refresh_token || undefined,
    idToken: user.id_token || undefined,
    tokenType: user.token_type || 'Bearer',
    expiresAt: user.expires_at || 0,
    scopes: user.scope?.split(' ') || [],
  };
};

// 工具函数：从 User 对象中提取基础信息
const extractBasicInfo = (user: User) => {
  if (!user.profile) return null;
  return {
    id: user.profile.sub,
    email: user.profile.email,
    name: user.profile.name,
  };
};

// 创建Zustand store
export const useOIDCStore = create<OIDCState>()(
  persist(
    (set, get) => ({
      // 初始状态
      user: null,
      userInfo: null,
      isLoadingUserInfo: false,
      isLoading: true,
      isAuthenticated: false,
      error: null,
      tokenInfo: null,
      isRefreshing: false,
      lastRefreshTime: null,
      refreshTimer: null,

      // 基础设置方法
      setUser: (user) => {
        const tokenInfo = user ? extractTokenInfo(user) : null;
        const isAuthenticated = !!user && !!tokenInfo;

        set({
          user,
          tokenInfo,
          isAuthenticated,
          error: null,
        });

        // 设置或清除自动刷新定时器
        if (isAuthenticated) {
          get().scheduleTokenRefresh();
          // 认证成功后自动加载用户信息
          get().loadUserInfo();
        } else {
          get().clearRefreshTimer();
        }
      },

      setUserInfo: (userInfo) => set({ userInfo }),

      setLoading: (isLoading) => set({ isLoading }),

      setLoadingUserInfo: (isLoadingUserInfo) => set({ isLoadingUserInfo }),

      setError: (error) => set({ error }),

      setTokenInfo: (tokenInfo) => set({ tokenInfo }),

      setIsRefreshing: (isRefreshing) => set({ isRefreshing }),

      // 认证相关方法
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
            isLoading: false,
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
          get().clearRefreshTimer();
          await userManager.signoutRedirect();
          get().clearState();
        } catch (err) {
          set({
            error: err instanceof Error ? err : new Error('Logout failed'),
            isLoading: false,
          });
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
          console.error('OIDC: Load user failed', err);
          set({
            error:
              err instanceof Error ? err : new Error('Failed to load user'),
          });
        } finally {
          set({ isLoading: false });
        }
      },

      // 加载用户信息
      loadUserInfo: async () => {
        const { user } = get();

        if (!user) {
          console.warn('用户未认证，跳过用户信息加载');
          return;
        }

        try {
          set({ isLoadingUserInfo: true, error: null });

          const userInfo = await API.getUserInfo();
          set({ userInfo });
        } catch (error) {
          console.error('用户信息加载异常:', error);
          set({
            error:
              error instanceof Error ? error : new Error('加载用户信息失败'),
            userInfo: null,
          });
        } finally {
          set({ isLoadingUserInfo: false });
        }
      },

      clearState: () => {
        get().clearRefreshTimer();
        set({
          user: null,
          userInfo: null,
          isLoadingUserInfo: false,
          isLoading: false,
          isAuthenticated: false,
          error: null,
          tokenInfo: null,
          isRefreshing: false,
          lastRefreshTime: null,
          refreshTimer: null,
        });
      },

      // Token 管理方法
      refreshTokens: async () => {
        const { isRefreshing, tokenInfo } = get();

        if (isRefreshing) {
          console.log('OIDC: Token refresh already in progress');
          return false;
        }

        if (!userManager) {
          console.error('OIDC: UserManager not initialized');
          return false;
        }

        if (!tokenInfo?.refreshToken) {
          console.error('OIDC: No refresh token available');
          return false;
        }

        try {
          set({ isRefreshing: true, error: null });
          console.log('OIDC: Starting token refresh');

          // 使用静默续期
          const newUser = await userManager.signinSilent();

          if (newUser && newUser.access_token) {
            get().setUser(newUser);
            set({
              lastRefreshTime: Date.now(),
              isRefreshing: false,
            });
            console.log('OIDC: Token refresh successful');
            return true;
          } else {
            throw new Error('No access token received');
          }
        } catch (err) {
          console.error('OIDC: Token refresh failed', err);
          set({
            error:
              err instanceof Error ? err : new Error('Token refresh failed'),
            isRefreshing: false,
          });

          // 如果刷新失败，可能需要重新登录
          if (err instanceof Error && err.message.includes('login_required')) {
            get().clearState();
          }

          return false;
        }
      },

      scheduleTokenRefresh: () => {
        const { tokenInfo, refreshTimer } = get();

        // 清除现有定时器
        if (refreshTimer) {
          clearTimeout(refreshTimer);
        }

        if (!tokenInfo) return;

        const now = Date.now() / 1000; // 转换为秒
        const expiresIn = tokenInfo.expiresAt - now;

        // 在 token 过期前 5 分钟开始刷新
        const refreshIn = Math.max(0, expiresIn - 300) * 1000; // 转换为毫秒

        console.log(
          `OIDC: Scheduling token refresh in ${refreshIn / 1000} seconds`
        );

        const timer = setTimeout(() => {
          get().refreshTokens();
        }, refreshIn);

        set({ refreshTimer: timer });
      },

      clearRefreshTimer: () => {
        const { refreshTimer } = get();
        if (refreshTimer) {
          clearTimeout(refreshTimer);
          set({ refreshTimer: null });
        }
      },

      isTokenExpired: () => {
        const { tokenInfo } = get();
        if (!tokenInfo) return true;

        const now = Date.now() / 1000;
        return now >= tokenInfo.expiresAt;
      },

      isTokenExpiringSoon: (thresholdSeconds = 300) => {
        const { tokenInfo } = get();
        if (!tokenInfo) return true;

        const now = Date.now() / 1000;
        return tokenInfo.expiresAt - now <= thresholdSeconds;
      },

      getValidAccessToken: async () => {
        const {
          tokenInfo,
          isTokenExpired,
          isTokenExpiringSoon,
          refreshTokens,
        } = get();

        if (!tokenInfo) return null;

        // 如果 token 已过期，尝试刷新
        if (isTokenExpired()) {
          console.log('OIDC: Access token expired, attempting refresh');
          const success = await refreshTokens();
          if (!success) return null;
          return get().tokenInfo?.accessToken || null;
        }

        // 如果 token 即将过期，主动刷新
        if (isTokenExpiringSoon()) {
          console.log('OIDC: Access token expiring soon, attempting refresh');
          await refreshTokens(); // 不等待结果，继续返回当前 token
        }

        return tokenInfo.accessToken;
      },
    }),
    {
      name: 'oidc-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),
      // 只持久化必要的状态，不持久化 loading、error、timer 等临时状态
      partialize: (state) => ({
        user: state.user,
        userInfo: state.userInfo,
        tokenInfo: state.tokenInfo,
        isAuthenticated: state.isAuthenticated,
        lastRefreshTime: state.lastRefreshTime,
      }),
      // 从持久化存储恢复后的处理
      onRehydrateStorage: () => (state) => {
        if (state?.isAuthenticated && state?.tokenInfo) {
          // 恢复后重新设置自动刷新定时器
          state.scheduleTokenRefresh();
        }
      },
    }
  )
);

// 导出类型供其他文件使用
export type { OIDCState };
