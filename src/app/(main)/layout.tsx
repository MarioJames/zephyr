'use client';

import React, { useEffect } from 'react';
import SideBar from './_layout/SideBar';
import { Flexbox } from 'react-layout-kit';
import { useOIDC } from '@/hooks/useOIDC';
import Initializing from '@/components/Initializing';
import { useInitializing } from '@/components/Initializing/useInitializing';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, login } = useOIDC();
  const { initializing } = useInitializing();

  // 简单的认证检查
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log('Layout: 用户未认证，启动登录流程');
      // 保存当前路径用于登录后返回
      const currentPath = window.location.pathname + window.location.search;
      if (currentPath !== '/') {
        sessionStorage.setItem('oidc_return_url', currentPath);
      }
      login();
    }
  }, [isAuthenticated, isLoading, login]);

  // 如果正在初始化或未认证，显示加载状态
  if (initializing || !isAuthenticated) {
    return <Initializing />;
  }

  return (
    <Flexbox
      height={'100%'}
      horizontal
      style={{
        position: 'relative',
      }}
      width={'100%'}
    >
      <SideBar />
      {children}
    </Flexbox>
  );
}
