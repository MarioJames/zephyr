'use client';

import { User } from 'oidc-client-ts';
import { userManager } from '@/config/oidc';
import { useOIDCStore } from '@/store/oidc';
import { useEffect } from 'react';

export function OIDCInitializer() {
  const { loadUser, setUser, setLoading, setError, clearState } = useOIDCStore();

  useEffect(() => {
    if (!userManager) {
      setLoading(false);
      return;
    }

    // 初始加载用户信息
    loadUser();

    // OIDC事件监听器
    const handleUserLoaded = (user: User) => {
      setUser(user);

      setLoading(false);
    };

    const handleUserUnloaded = () => {
      clearState();
    };

    const handleSilentRenewError = (error: Error) => {
      setError(error);
      setLoading(false);
    };

    // 注册事件监听器
    userManager.events.addUserLoaded(handleUserLoaded);
    userManager.events.addUserUnloaded(handleUserUnloaded);
    userManager.events.addSilentRenewError(handleSilentRenewError);

    // 清理函数
    return () => {
      userManager?.events.removeUserLoaded(handleUserLoaded);
      userManager?.events.removeUserUnloaded(handleUserUnloaded);
      userManager?.events.removeSilentRenewError(handleSilentRenewError);
    };
  }, [loadUser, setUser, setLoading, setError, clearState]);

  return null;
}
