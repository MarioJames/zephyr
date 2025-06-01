import { useCallback } from 'react';
import { useSessionStore } from '@/store/session';

// 自定义 hook 用于切换会话
const useSwitchSession = () => {
  const { setActiveSession } = useSessionStore();

  // 切换会话的回调函数
  const switchSession = useCallback((sessionId: string) => {
    setActiveSession(sessionId);
  }, [setActiveSession]);

  return switchSession;
};

export default useSwitchSession;