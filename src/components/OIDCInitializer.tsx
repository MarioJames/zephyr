'use client';

import { User } from 'oidc-client-ts';
import { userManager } from '@/config/oidc';
import { useOIDCStore } from '@/store/oidc';
import { useEffect } from 'react';

export function OIDCInitializer() {
  const { 
    loadUser, 
    setUser, 
    setLoading, 
    setError, 
    clearState,
    scheduleTokenRefresh,
    login 
  } = useOIDCStore();

  useEffect(() => {
    if (!userManager) {
      setLoading(false);
      return;
    }

    // 初始加载用户信息
    loadUser();

    // OIDC事件监听器
    const handleUserLoaded = (user: User) => {
      console.log('OIDCInitializer: User loaded', user.profile);
      setUser(user);
      setLoading(false);
    };

    const handleUserUnloaded = () => {
      console.log('OIDCInitializer: User unloaded');
      clearState();
    };

    const handleAccessTokenExpiring = () => {
      console.log('OIDCInitializer: Access token expiring');
      // 自动刷新机制已在 store 中处理
    };

    const handleAccessTokenExpired = async () => {
      console.log('OIDCInitializer: Access token expired');
      
      try {
        // 首先尝试静默刷新令牌
        if (userManager) {
          const user = await userManager.signinSilent();
          if (user && user.access_token) {
            console.log('OIDCInitializer: Token refreshed successfully');
            setUser(user);
            return;
          }
        }
      } catch (error) {
        console.error('OIDCInitializer: Silent token refresh failed', error);
      }
      
      // 静默刷新失败，清除状态并触发重新登录
      console.log('OIDCInitializer: Token refresh failed, triggering re-login');
      clearState();
      
      // 触发重新登录
      try {
        await login();
      } catch (error) {
        console.error('OIDCInitializer: Re-login failed', error);
        // 如果重新登录也失败，跳转到首页让用户手动登录
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      }
    };

    const handleSilentRenewError = (error: Error) => {
      console.error('OIDCInitializer: Silent renew error', error);
      setError(error);
      
      // 如果静默续期失败且错误提示需要重新登录，清除状态
      const needsReauth = [
        'login_required',
        'interaction_required',
        'invalid_grant',
        'unauthorized',
        'access_denied'
      ].some(errorType => error.message.toLowerCase().includes(errorType.toLowerCase()));
      
      if (needsReauth) {
        console.log('OIDCInitializer: Silent renew requires re-authentication, clearing state');
        clearState();
        
        // 引导用户到认证网关
        if (typeof window !== 'undefined' && window.location.pathname !== '/') {
          console.log('OIDCInitializer: Redirecting to authentication gateway');
          window.location.href = '/';
        }
      }
    };

    const handleUserSignedOut = () => {
      console.log('OIDCInitializer: User signed out');
      clearState();
    };

    // 注册事件监听器
    userManager.events.addUserLoaded(handleUserLoaded);
    userManager.events.addUserUnloaded(handleUserUnloaded);
    userManager.events.addAccessTokenExpiring(handleAccessTokenExpiring);
    userManager.events.addAccessTokenExpired(handleAccessTokenExpired);
    userManager.events.addSilentRenewError(handleSilentRenewError);
    userManager.events.addUserSignedOut(handleUserSignedOut);

    // 清理函数
    return () => {
      userManager?.events.removeUserLoaded(handleUserLoaded);
      userManager?.events.removeUserUnloaded(handleUserUnloaded);
      userManager?.events.removeAccessTokenExpiring(handleAccessTokenExpiring);
      userManager?.events.removeAccessTokenExpired(handleAccessTokenExpired);
      userManager?.events.removeSilentRenewError(handleSilentRenewError);
      userManager?.events.removeUserSignedOut(handleUserSignedOut);
    };
  }, [loadUser, setUser, setLoading, setError, clearState, scheduleTokenRefresh, login]);

  return null;
}
