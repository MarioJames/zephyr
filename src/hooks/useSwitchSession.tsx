import { useCallback } from 'react';

import { useChatStore } from '@/store/chat';
import { useSessionStore } from '@/store/session';

export const useSwitchSession = () => {
  const switchSession = useSessionStore((s) => s.switchSession);
  const togglePortal = useChatStore((s) => s.togglePortal);

  return useCallback(
    (id: string) => {
      switchSession(id);
      togglePortal(false);
    },
    [],
  );
};
