import { useEffect } from 'react';
import { useChatStore } from '@/store/chat';
import { chatSelectors } from '@/store/chat/selectors';

export const useFetchMessages = () => {
  const activeTopicId = useChatStore(chatSelectors.activeTopicId);
  const fetchMessages = useChatStore((s) => s.fetchMessages);

  useEffect(() => {
    fetchMessages(activeTopicId);
  }, [activeTopicId, fetchMessages]);
};
