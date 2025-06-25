import { useChatStore } from '@/store/chat';

/**
 * Fetch topics for the current session
 */
export const useFetchTopics = () => {
  const sessionId = useChatStore((s) => s.activeId);
  const fetchTopics = useChatStore((s) => s.fetchTopics);

  fetchTopics(sessionId);
};
