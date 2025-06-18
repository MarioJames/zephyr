import { ChatTopic, ChatTopicSummary, GroupedTopic } from '@/types/topic';
import { groupTopicsByTime } from '@/utils/client/topic';

import { ChatStoreState } from '../../initialState';

const currentTopics = (s: ChatStoreState): ChatTopic[] | undefined => s.topicMaps[s.activeId];

const currentActiveTopic = (s: ChatStoreState): ChatTopic | undefined => {
  return currentTopics(s)?.find((topic) => topic.id === s.activeTopicId);
};
const searchTopics = (s: ChatStoreState): ChatTopic[] => s.searchTopics;

const displayTopics = (s: ChatStoreState): ChatTopic[] | undefined => currentTopics(s);

const currentTopicLength = (s: ChatStoreState): number => currentTopics(s)?.length || 0;

const getTopicById =
  (id: string) =>
  (s: ChatStoreState): ChatTopic | undefined =>
    currentTopics(s)?.find((topic) => topic.id === id);

const currentActiveTopicSummary = (s: ChatStoreState): ChatTopicSummary | undefined => {
  const activeTopic = currentActiveTopic(s);
  if (!activeTopic) return undefined;

  return {
    content: activeTopic.historySummary || '',
    model: activeTopic.metadata?.model || '',
    provider: activeTopic.metadata?.provider || '',
  };
};

const isCreatingTopic = (s: ChatStoreState) => s.creatingTopic;
const isUndefinedTopics = (s: ChatStoreState) => !currentTopics(s);
const isInSearchMode = (s: ChatStoreState) => s.inSearchingMode;
const isSearchingTopic = (s: ChatStoreState) => s.isSearchingTopic;

const groupedTopicsSelector = (s: ChatStoreState): GroupedTopic[] => {
  const topics = displayTopics(s);

  if (!topics) return [];

  return topics.length > 0
    ? [
        {
          children: topics,
          id: 'default',
          title: '默认',
        },
        ...groupTopicsByTime(topics),
      ]
    : groupTopicsByTime(topics);
};

export const topicSelectors = {
  currentActiveTopic,
  currentActiveTopicSummary,
  currentTopicLength,
  currentTopics,
  displayTopics,
  getTopicById,
  groupedTopicsSelector,
  isCreatingTopic,
  isInSearchMode,
  isSearchingTopic,
  isUndefinedTopics,
  searchTopics,
};
