'use client';

import React, { useEffect } from 'react';
import SideBar from './_layout/SideBar';
import { Flexbox } from 'react-layout-kit';
import Initializing from '@/components/Initializing';
import { useInitializing } from '@/components/Initializing/useInitializing';
import { useGlobalStore } from '@/store/global/store';
import { useRouter } from 'next/navigation';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { initializing } = useInitializing();
  const router = useRouter();
  const { currentUser, userInit, checkUserRoleEnabled } = useGlobalStore(
    (s) => ({
      currentUser: s.currentUser,
      userInit: s.userInit,
      checkUserRoleEnabled: s.checkUserRoleEnabled,
    })
  );

  // 角色状态检查
  useEffect(() => {
    if (userInit && currentUser) {
      if (!checkUserRoleEnabled()) {
        router.push('/403');
      } else {
        // 角色检查通过，继续正常流程
      }
    }
  }, [userInit, currentUser, checkUserRoleEnabled]);

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
