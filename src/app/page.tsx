'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOIDC } from '@/hooks/useOIDC';
import Initializing from './loading';

/**
 * 应用默认根路径页面
 * 负责初始化认证检查和路由重定向
 */
export default function HomePage() {
  const router = useRouter();

  const {
    isAuthenticated,
    isLoading,
    userInfo,
    error,
    login,
    getValidAccessToken,
  } = useOIDC();

  useEffect(() => {
    const handleAuth = async () => {
      // 等待OIDC初始化完成
      if (isLoading) {
        return;
      }

      // 如果有错误，清理后重新登录
      if (error) {
        console.warn('OIDC认证错误，将重新登录:', error.message);
        await login();
        return;
      }

      // 如果已认证，检查token有效性
      if (isAuthenticated && userInfo) {
        try {
          // 尝试获取有效的access token，这会自动检查过期并刷新
          const validToken = await getValidAccessToken();

          if (validToken) {
            router.replace('/chat');
          } else {
            await login();
          }
        } catch (error) {
          console.error('Token验证失败，重新登录:', error);
          await login();
        }
      } else {
        // 未认证，执行登录
        await login();
      }
    };

    handleAuth();
  }, [
    isAuthenticated,
    isLoading,
    userInfo,
    error,
    router,
    login,
    getValidAccessToken,
  ]);

  return <Initializing />;
}
