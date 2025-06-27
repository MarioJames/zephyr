'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOIDC } from '@/hooks/useOIDC';
import Initializing from './loading';

/**
 * 应用认证网关页面
 * 作为唯一的认证检查和重定向入口
 */
export default function HomePage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  const {
    isAuthenticated,
    isLoading,
    userInfo,
    error,
    login,
    getValidAccessToken,
    clearError,
  } = useOIDC();

  useEffect(() => {
    const handleAuth = async () => {
      // 防止重复检查
      if (authChecked) return;

      // 等待OIDC初始化完成
      if (isLoading) {
        return;
      }

      console.log('认证网关: 开始认证检查', { isAuthenticated, userInfo: !!userInfo, error: !!error });

      try {
        // 如果已认证且有用户信息
        if (isAuthenticated && userInfo) {
          // 检查token有效性
          const validToken = await getValidAccessToken();
          
          if (validToken) {
            console.log('认证网关: 认证有效，跳转到 /chat');
            setAuthChecked(true);
            router.replace('/chat');
            return;
          } else {
            console.log('认证网关: Token无效，需要重新登录');
          }
        }

        // 如果有错误，清除错误状态
        if (error) {
          console.log('认证网关: 清除认证错误，重新登录');
          clearError();
        }

        // 需要登录
        console.log('认证网关: 开始登录流程');
        await login();
        
      } catch (error) {
        console.error('认证网关: 认证检查失败', error);
        // 出错时重新开始登录流程
        await login();
      }
    };

    handleAuth();
  }, [isAuthenticated, isLoading, userInfo, error, authChecked]);

  return <Initializing />;
}
