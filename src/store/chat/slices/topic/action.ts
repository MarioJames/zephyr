import { StateCreator } from 'zustand';
import topicService, { TopicItem, TopicCreateRequest } from '@/services/topics';
import { ChatStore } from '../../store';
import { useSessionStore } from '@/store/session';
import { syncUrlParams } from '@/utils/url';

export interface TopicAction {
  // 话题CRUD操作
  fetchTopics: (sessionId: string) => Promise<TopicItem[] | undefined>;
  createTopic: (data: TopicCreateRequest) => Promise<TopicItem>;
  updateTopicTitle: (id: string, title: string) => Promise<void>;
  updateTopic: (id: string, topic: TopicItem) => void;

  // 话题切换
  switchTopic: (topicId: string) => Promise<void>;

  // 搜索相关
  useSearchTopics: (keyword: string, sessionId: string) => void;
  clearTopicSearchResult: () => void;
}

export const topicSlice: StateCreator<ChatStore, [], [], TopicAction> = (
  set,
  get
) => ({
  fetchTopics: async (sessionId: string) => {
    set({ fetchTopicLoading: true, error: undefined });

    try {
      const topics = await topicService.getTopicList(sessionId);
      set({
        topics,
        topicsInit: true,
        fetchTopicLoading: false,
        error: undefined,
      });

      return topics;
    } catch (error) {
      console.error('Failed to fetch topics:', error);
      set({
        fetchTopicLoading: false,
        error:
          error instanceof Error ? error.message : 'Failed to fetch topics',
        topicsInit: true,
      });
    }
  },

  createTopic: async (data: TopicCreateRequest) => {
    try {
      const newTopic = await topicService.createTopic(data);
      set((state) => ({
        topics: [newTopic, ...state.topics],
      }));
      return newTopic;
    } catch (error) {
      console.error('Failed to create topic:', error);
      throw error;
    }
  },

  updateTopicTitle: async (id: string, title: string) => {
    try {
      // 暂时本地更新，实际项目中需要调用API
      set((state) => ({
        topics: state.topics.map((topic) =>
          topic.id === id ? { ...topic, title } : topic
        ),
      }));

      // TODO: 调用实际的更新API
      // await topicService.updateTopic(id, { title });
    } catch (error) {
      console.error('Failed to update topic title:', error);
      throw error;
    }
  },

  switchTopic: async (topicId: string) => {
    // 设置当前话题
    useSessionStore.getState().setActiveTopic(topicId);
    set({ messagesInit: false });

    // 切换话题时重新获取消息
    const { fetchMessages, fetchSuggestions } = get();

    if (topicId) {
      await Promise.all([fetchMessages(topicId), fetchSuggestions(topicId)]);
    } else {
      set({ messages: [], messagesInit: true });
    }

    // 同步URL参数
    const activeSessionId = useSessionStore.getState().activeSessionId;
    syncUrlParams({
      session: activeSessionId,
      topic: topicId,
    });
  },

  useSearchTopics: (keyword: string, sessionId: string) => {
    set({ isSearchingTopic: true });
    topicService
      .getTopicList(sessionId, { keyword })
      .then((topics: TopicItem[]) => {
        set({ searchTopics: topics, isSearchingTopic: false });
      })
      .catch((error: Error) => {
        console.error('Failed to search topics:', error);
        set({ isSearchingTopic: false });
      });
  },

  clearTopicSearchResult: () => {
    set({ searchTopics: [], isSearchingTopic: false });
  },

  updateTopic: (id: string, topic: TopicItem) => {
    set((state) => ({
      topics: state.topics.map((t) => (t.id === id ? topic : t)),
    }));
  },
});
