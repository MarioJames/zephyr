'use client';

import React from 'react';
import SideBar from './_layout/SideBar';
import { Flexbox } from 'react-layout-kit';
import Initializing from '@/components/Initializing';
import { useInitializing } from '@/components/Initializing/useInitializing';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { initializing } = useInitializing();

  // 如果正在初始化，显示加载状态
  if (initializing) {
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
