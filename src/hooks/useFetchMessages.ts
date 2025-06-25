import { useChatStore } from '@/store/chat';

export const useFetchMessages = () => {
  const activeTopicId = useChatStore((s) => s.activeTopicId);
  const fetchMessages = useChatStore((s) => s.fetchMessages);

  fetchMessages(activeTopicId);
};
