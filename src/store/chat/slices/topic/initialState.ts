import { TopicItem } from '@/services/topics';

export interface TopicState {
  topics: TopicItem[];
  topicsInit: boolean;
  searchTopics: TopicItem[];
  isSearchingTopic: boolean;
  inSearchingMode: boolean;
  topicRenamingId?: string;
}

export const initialTopicState: TopicState = {
  topics: [],
  topicsInit: false,
  searchTopics: [],
  isSearchingTopic: false,
  inSearchingMode: false,
  topicRenamingId: undefined,
};