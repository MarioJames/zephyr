import { StateCreator } from 'zustand';
import topicService, { TopicItem, TopicCreateRequest } from '@/services/topics';
import { ChatStore } from '../../store';

export interface TopicAction {
  // 话题CRUD操作
  fetchTopics: (sessionId: string) => Promise<void>;
  createTopic: (data: TopicCreateRequest) => Promise<TopicItem>;
  updateTopicTitle: (id: string, title: string) => Promise<void>;
  removeTopic: (id: string) => Promise<void>;
  
  // 话题切换
  switchTopic: (topicId?: string) => void;
  
  // 搜索相关
  useSearchTopics: (keyword: string, sessionId: string) => void;
  clearTopicSearchResult: () => void;
  
  // 重命名相关
  startTopicRename: (id: string) => void;
  finishTopicRename: () => void;
}

export const topicSlice: StateCreator<
  ChatStore,
  [],
  [],
  TopicAction
> = (set, get) => ({
  fetchTopics: async (sessionId: string) => {
    set({ isLoading: true, error: undefined });
    try {
      const topics = await topicService.getTopicList(sessionId);
      set({ 
        topics, 
        topicsInit: true, 
        isLoading: false,
        error: undefined 
      });
    } catch (error) {
      console.error('Failed to fetch topics:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch topics',
        topicsInit: true 
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
        topics: state.topics.map(topic =>
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

  removeTopic: async (id: string) => {
    try {
      await topicService.deleteTopic(id);
      set((state) => ({
        topics: state.topics.filter(topic => topic.id !== id),
        activeTopicId: state.activeTopicId === id ? undefined : state.activeTopicId,
      }));
    } catch (error) {
      console.error('Failed to remove topic:', error);
      throw error;
    }
  },

  switchTopic: (topicId?: string) => {
    set({ activeTopicId: topicId });
    
    // 切换话题时重新获取消息
    if (topicId) {
      get().fetchMessages(topicId);
    } else {
      set({ messages: [], messagesInit: true });
    }
  },

  useSearchTopics: (keyword: string, sessionId: string) => {
    if (!keyword.trim()) {
      set({ 
        searchTopics: [], 
        isSearchingTopic: false,
        inSearchingMode: false 
      });
      return;
    }

    const state = get();
    const filteredTopics = state.topics.filter(topic =>
      topic.title?.toLowerCase().includes(keyword.toLowerCase())
    );

    set({ 
      searchTopics: filteredTopics, 
      isSearchingTopic: true,
      inSearchingMode: true 
    });
  },

  clearTopicSearchResult: () => {
    set({ 
      searchTopics: [], 
      isSearchingTopic: false,
      inSearchingMode: false 
    });
  },

  startTopicRename: (id: string) => {
    set({ topicRenamingId: id });
  },

  finishTopicRename: () => {
    set({ topicRenamingId: undefined });
  },
});