import { useEffect } from 'react';
import { useChatStore } from '@/store/chat';
import { sessionSelectors, useSessionStore } from '@/store/session';

export const useFetchMessages = () => {
  const activeTopicId = useSessionStore(sessionSelectors.activeTopicId);
  const fetchMessages = useChatStore((s) => s.fetchMessages);

  useEffect(() => {
    fetchMessages(activeTopicId);
  }, [activeTopicId, fetchMessages]);
};
