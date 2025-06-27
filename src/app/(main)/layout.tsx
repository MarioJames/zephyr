'use client';

import React, { useEffect } from "react";
import { useRouter, usePathname } from 'next/navigation';
import SideBar from "./_layout/SideBar";
import { Flexbox } from "react-layout-kit";
import { useOIDC } from '@/hooks/useOIDC';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  
  const {
    isAuthenticated,
    isLoading,
    userInfo,
  } = useOIDC();

  useEffect(() => {
    // 如果OIDC还在加载中，等待
    if (isLoading) {
      return;
    }

    // 如果未认证或没有用户信息，且当前不在根路径，重定向到根页面
    if ((!isAuthenticated || !userInfo) && pathname !== '/') {
      console.log('(main) layout: 未认证，重定向到根页面');
      router.replace('/');
      return;
    }
  }, [isAuthenticated, isLoading, userInfo, router, pathname]);

  // 如果正在加载或未认证，显示加载状态
  if (isLoading) {
    return null; // 让页面级loading.tsx处理
  }

  // 如果未认证，不显示内容
  if (!isAuthenticated || !userInfo) {
    return null;
  }

  return (
    <Flexbox
      height={"100%"}
      horizontal
      style={{
        position: "relative",
      }}
      width={"100%"}
    >
      <SideBar />
      {children}
    </Flexbox>
  );
}