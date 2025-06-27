'use client';

import React from "react";
import SideBar from "./_layout/SideBar";
import { Flexbox } from "react-layout-kit";
import { useOIDC } from '@/hooks/useOIDC';

export default function Layout({ children }: { children: React.ReactNode }) {
  const {
    isAuthenticated,
    isLoading,
    userInfo,
  } = useOIDC();

  console.log('(main) layout: 认证状态检查', { 
    isLoading, 
    isAuthenticated, 
    hasUserInfo: !!userInfo 
  });

  // 如果正在加载，显示加载状态
  if (isLoading) {
    return null; // 让页面级loading.tsx处理
  }

  // 如果未认证，不显示内容（用户应该在认证网关页面）
  if (!isAuthenticated || !userInfo) {
    console.log('(main) layout: 未认证，不显示内容');
    return null;
  }

  console.log('(main) layout: 已认证，显示主界面');

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