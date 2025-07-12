import { TopicItem } from '@/services/topics';

export interface TopicState {
  topicsInit: boolean;
  fetchTopicLoading: boolean;
  topics: TopicItem[];
  searchTopics: TopicItem[];
  isSearchingTopic: boolean;
  topicRenamingId?: string;
  activeTopicId?: string;
}

export const initialTopicState: TopicState = {
  topicsInit: false,
  fetchTopicLoading: false,
  topics: [],
  searchTopics: [],
  isSearchingTopic: false,
  topicRenamingId: undefined,
  activeTopicId: undefined,
};
