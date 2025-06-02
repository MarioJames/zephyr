import { useMemo } from 'react';
import { useQueryRoute } from '@/hooks/useQueryRoute';
import { useAgentStore } from '@/store/agent';
import { ChatSettingsTabs } from '@/store/global/initialState';
import { useSessionStore } from '@/store/session';

export const useOpenChatSettings = (tab: ChatSettingsTabs = ChatSettingsTabs.Meta) => {
  const activeId = useSessionStore((s) => s.activeId);

  const router = useQueryRoute();

  return useMemo(() => {


    return () => {
      useAgentStore.setState({ showAgentSetting: true });
    };
  }, [activeId, router, tab]);
};
