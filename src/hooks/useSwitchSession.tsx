import { useCallback } from 'react';
import { useSessionStore } from '@/store/session';

export const useSwitchSession = () => {
  const switchSession = useSessionStore((s) => s.switchSession);

  return useCallback(
    (id: string) => {
      switchSession(id);
    },
    [switchSession]
  );
};
