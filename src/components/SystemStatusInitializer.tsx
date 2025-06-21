'use client';

import { useGlobalStore } from '@/store/global';

const SystemStatusInitializer = () => {
  const useInitSystemStatus = useGlobalStore((s) => s.useInitSystemStatus);
  
  // 初始化系统状态
  useInitSystemStatus();

  return null;
};

export default SystemStatusInitializer; 