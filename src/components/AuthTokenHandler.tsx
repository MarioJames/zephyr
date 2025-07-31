'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

/**
 * 处理认证 Token 的客户端组件
 * 负责将 accessToken 保存到 localStorage
 */
export default function AuthTokenHandler() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated' && session?.accessToken) {
      // 将 accessToken 保存到 localStorage
      localStorage.setItem('accessToken', session.accessToken);
      
      // 可选：也保存 refreshToken
      if (session.refreshToken) {
        localStorage.setItem('refreshToken', session.refreshToken);
      }
      
      // 保存过期时间
      if (session.expiresAt) {
        localStorage.setItem('tokenExpiresAt', session.expiresAt.toString());
      }
      
      console.log('AccessToken saved to localStorage');
    } else if (status === 'unauthenticated') {
      // 用户未认证时清除本地存储的 token
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tokenExpiresAt');
      
      console.log('Tokens cleared from localStorage');
    }
  }, [session, status]);

  // 这个组件不渲染任何内容
  return null;
}