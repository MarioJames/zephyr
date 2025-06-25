import { StateCreator } from 'zustand/vanilla';

import { userManager } from '@/config/oidc';
import { OIDCStore } from '../../store';
import { TokenInfo } from './initialState';

/**
 * OIDC Token管理操作接口
 */
export interface OIDCTokenAction {
  /**
   * 设置Token信息
   */
  setTokenInfo: (tokenInfo: TokenInfo | null) => void;
  
  /**
   * 设置Token刷新状态
   */
  setIsRefreshing: (isRefreshing: boolean) => void;
  
  /**
   * 刷新Token
   */
  refreshTokens: () => Promise<boolean>;
  
  /**
   * 安排Token自动刷新
   */
  scheduleTokenRefresh: () => void;
  
  /**
   * 清除刷新定时器
   */
  clearRefreshTimer: () => void;
  
  /**
   * 检查Token是否过期
   */
  isTokenExpired: () => boolean;
  
  /**
   * 检查Token是否即将过期
   */
  isTokenExpiringSoon: (thresholdSeconds?: number) => boolean;
  
  /**
   * 获取有效的访问Token
   */
  getValidAccessToken: () => Promise<string | null>;
}

/**
 * 创建OIDC Token管理slice
 */
export const createOIDCTokenSlice: StateCreator<
  OIDCStore,
  [],
  [],
  OIDCTokenAction
> = (set, get) => ({
  setTokenInfo: (tokenInfo) => set({ tokenInfo }),

  setIsRefreshing: (isRefreshing) => set({ isRefreshing }),

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
        error: err instanceof Error ? err : new Error('Token refresh failed'),
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
});