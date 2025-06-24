import { StateCreator } from 'zustand/vanilla';
import { User } from 'oidc-client-ts';

import { userManager } from '@/config/oidc';
import { OIDCStore } from '../../store';

/**
 * OIDC认证操作接口
 */
export interface OIDCAuthAction {
  /**
   * 设置用户信息
   */
  setUser: (user: User | null) => void;
  
  /**
   * 设置加载状态
   */
  setLoading: (loading: boolean) => void;
  
  /**
   * 设置错误状态
   */
  setError: (error: Error | null) => void;
  
  /**
   * 用户登录
   */
  login: () => Promise<void>;
  
  /**
   * 用户登出
   */
  logout: () => Promise<void>;
  
  /**
   * 加载用户信息
   */
  loadUser: () => Promise<void>;
  
  /**
   * 清除状态
   */
  clearState: () => void;
}

// 工具函数：从 User 对象中提取 Token 信息
const extractTokenInfo = (user: User) => {
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

/**
 * 创建OIDC认证slice
 */
export const createOIDCAuthSlice: StateCreator<
  OIDCStore,
  [['zustand/devtools', never]],
  [],
  OIDCAuthAction
> = (set, get) => ({
  setUser: (user) => {
    const tokenInfo = user ? extractTokenInfo(user) : null;
    const isAuthenticated = !!user && !!tokenInfo;

    set({
      user,
      isAuthenticated,
      error: null,
    });

    // 设置Token信息
    get().setTokenInfo(tokenInfo);

    // 设置或清除自动刷新定时器
    if (isAuthenticated) {
      get().scheduleTokenRefresh();
      // 认证成功后自动加载用户信息
      get().loadUserInfo();
    } else {
      get().clearRefreshTimer();
    }
  },

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

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
        error: err instanceof Error ? err : new Error('Failed to load user'),
      });
    } finally {
      set({ isLoading: false });
    }
  },

  clearState: () => {
    get().clearRefreshTimer();
    set({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,
      userInfo: null,
      isLoadingUserInfo: false,
      tokenInfo: null,
      isRefreshing: false,
      lastRefreshTime: null,
      refreshTimer: null,
    });
  },
});