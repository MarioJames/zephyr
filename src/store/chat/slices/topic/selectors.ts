import { useSessionStore } from '@/store/session';
import { ChatState } from '../..';
import { TopicItem } from '@/services/topics';

const topicsInit = (s: ChatState) => s.topicsInit;
const fetchTopicLoading = (s: ChatState) => s.fetchTopicLoading;
const topics = (s: ChatState) => s.topics;
const searchTopics = (s: ChatState) => s.searchTopics;
const isSearchingTopic = (s: ChatState) => s.isSearchingTopic;
const topicRenamingId = (s: ChatState) => s.topicRenamingId;

const currentActiveTopic = (s: ChatState): TopicItem | undefined => {
  const activeTopicId = useSessionStore.getState().activeTopicId;

  return s.topics.find((topic) => topic.id === activeTopicId);
};

export const topicSelectors = {
  topics,
  topicsInit,
  fetchTopicLoading,
  searchTopics,
  isSearchingTopic,
  topicRenamingId,
  currentActiveTopic,
};
