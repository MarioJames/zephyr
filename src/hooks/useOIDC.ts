'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useOIDCStore } from '@/store/oidc';
import { userManager } from '@/config/oidc';

export interface UseOIDCReturn {
  // 状态
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoadingUserInfo: boolean;
  isRefreshing: boolean;
  user: any;
  userInfo: any;
  tokenInfo: any;
  error: Error | null;

  // 方法
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<boolean>;
  getValidAccessToken: () => Promise<string | null>;
  loadUserInfo: () => Promise<void>;
  clearError: () => void;
}

/**
 * OIDC 认证 Hook
 * 提供完整的 OIDC 认证状态管理和方法
 */
export const useOIDC = (): UseOIDCReturn => {
  const {
    user,
    userInfo,
    tokenInfo,
    isLoading,
    isLoadingUserInfo,
    isAuthenticated,
    isRefreshing,
    error,
    login: storeLogin,
    logout: storeLogout,
    refreshTokens: storeRefreshTokens,
    getValidAccessToken: storeGetValidAccessToken,
    loadUserInfo: storeLoadUserInfo,
    setError,
    loadUser,
  } = useOIDCStore();

  // 增强的登录方法，保存当前页面用于回调后跳转
  const login = useCallback(async () => {
    // 保存当前页面路径，用于登录后跳转
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname + window.location.search;
      // 如果当前在根路径，保存 /chat 作为返回地址，避免循环
      const returnUrl = currentPath === '/' ? '/chat' : currentPath;
      sessionStorage.setItem('oidc_return_url', returnUrl);
    }
    await storeLogin();
  }, [storeLogin]);

  // 增强的登出方法
  const logout = useCallback(async () => {
    try {
      await storeLogout();
    } catch (error) {
      console.error('OIDC: Logout error', error);
      // 即使登出失败，也清除本地状态
      useOIDCStore.getState().clearState();
    }
  }, [storeLogout]);

  // 清除错误
  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  // 检查认证状态并自动加载用户信息
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // 监听 UserManager 事件
  useEffect(() => {
    if (!userManager) return;

    const handleUserLoaded = (user: any) => {
      console.log('OIDC Hook: User loaded event', user.profile);
    };

    const handleUserUnloaded = () => {
      console.log('OIDC Hook: User unloaded event');
    };

    const handleAccessTokenExpiring = () => {
      console.log('OIDC Hook: Access token expiring event');
    };

    const handleAccessTokenExpired = () => {
      console.log('OIDC Hook: Access token expired event');
    };

    const handleSilentRenewError = (error: any) => {
      console.error('OIDC Hook: Silent renew error event', error);
      setError(error);
    };

    const handleUserSignedOut = () => {
      console.log('OIDC Hook: User signed out event');
      useOIDCStore.getState().clearState();
    };

    // 添加事件监听器
    userManager.events.addUserLoaded(handleUserLoaded);
    userManager.events.addUserUnloaded(handleUserUnloaded);
    userManager.events.addAccessTokenExpiring(handleAccessTokenExpiring);
    userManager.events.addAccessTokenExpired(handleAccessTokenExpired);
    userManager.events.addSilentRenewError(handleSilentRenewError);
    userManager.events.addUserSignedOut(handleUserSignedOut);

    // 清理函数
    return () => {
      if (!userManager) return;

      userManager.events.removeUserLoaded(handleUserLoaded);
      userManager.events.removeUserUnloaded(handleUserUnloaded);
      userManager.events.removeAccessTokenExpiring(handleAccessTokenExpiring);
      userManager.events.removeAccessTokenExpired(handleAccessTokenExpired);
      userManager.events.removeSilentRenewError(handleSilentRenewError);
      userManager.events.removeUserSignedOut(handleUserSignedOut);
    };
  }, [setError]);

  return {
    // 状态
    isAuthenticated,
    isLoading,
    isLoadingUserInfo,
    isRefreshing,
    user,
    userInfo,
    tokenInfo,
    error,

    // 方法
    login,
    logout,
    refreshTokens: storeRefreshTokens,
    getValidAccessToken: storeGetValidAccessToken,
    loadUserInfo: storeLoadUserInfo,
    clearError,
  };
};

/**
 * 用于保护需要认证的页面的 Hook
 * 自动重定向到登录页面如果用户未认证
 */
export const useRequireAuth = (redirectPath = '/login') => {
  const { isAuthenticated, isLoading } = useOIDC();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log('OIDC: User not authenticated, redirecting to login');
      router.push(redirectPath);
    }
  }, [isAuthenticated, isLoading, router, redirectPath]);

  return { isAuthenticated, isLoading };
};

/**
 * HTTP 请求拦截器 Hook
 * 自动在请求头中添加有效的 access token
 */
export const useOIDCHttpInterceptor = () => {
  const { getValidAccessToken } = useOIDC();

  const getAuthHeaders = useCallback(async () => {
    const token = await getValidAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [getValidAccessToken]);

  const createAuthenticatedFetch = useCallback(
    (input: RequestInfo | URL, init?: RequestInit) => {
      return getValidAccessToken().then((token) => {
        const headers = new Headers(init?.headers);
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
        return fetch(input, { ...init, headers });
      });
    },
    [getValidAccessToken]
  );

  return {
    getAuthHeaders,
    createAuthenticatedFetch,
  };
};
