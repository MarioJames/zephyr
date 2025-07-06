import { StateCreator } from 'zustand';
import sessionService, {
  SessionListRequest,
  SessionSearchRequest,
} from '@/services/sessions';
import { SessionStore } from '@/store/session';
import { topicsAPI, TopicItem } from '@/services';
import { useChatStore } from '@/store/chat';
import { useCustomerStore } from '@/store/customer';
import { useModelStore } from '@/store/model';
import { syncUrlParams } from '@/utils/url';

export interface SessionCoreAction {
  // 获取会话列表
  fetchSessions: (params?: SessionListRequest) => Promise<void>;
  // 切换会话
  switchSession: (sessionId: string, topicId?: string) => Promise<void>;
  // 搜索会话
  searchSessions: (params: SessionSearchRequest) => Promise<void>;
  // 清除搜索结果
  clearSearchResults: () => void;
  // 设置加载状态
  setLoading: (loading: boolean) => void;
  // 设置错误信息
  setError: (error?: string) => void;
  // 清除错误
  clearError: () => void;
}

export const sessionCoreAction: StateCreator<
  SessionStore,
  [],
  [],
  SessionCoreAction
> = (set, get) => ({
  fetchSessions: async (params?: SessionListRequest) => {
    set({ isLoading: true, error: undefined });
    try {
      const { sessions = [], total = 0 } = await sessionService.getSessionList(
        params
      );

      set({
        sessions,
        isLoading: false,
        isInitialized: true,
      });
    } catch (error) {
      console.error('获取会话列表失败:', error);
      set({
        isLoading: false,
        isInitialized: true,
        error: error instanceof Error ? error.message : '获取会话列表失败',
      });
    }
  },

  switchSession: async (sessionId: string, topicId?: string) => {
    let activeTopicId = topicId;

    // 获取客户拓展配置
    useCustomerStore.getState().getCustomerExtend(sessionId);

    // 获取模型配置
    useModelStore.getState().fetchModelConfig({ sessionId });

    // 如果没有传入话题ID，则获取会话下的所有话题
    if (!activeTopicId) {
      const topics = await topicsAPI.getTopicList(sessionId);

      activeTopicId = topics?.[0]?.id;
    }

    // 设置当前会话和话题
    set({
      activeTopicId,
      activeSessionId: sessionId,
    });

    // 重置聊天状态
    useChatStore.setState({
      messages: [],
      messagesInit: false,
      topics: [],
      topicsInit: false,
    });

    // 拉取建议
    useChatStore.getState().fetchSuggestions();

    // 同步URL参数
    syncUrlParams({
      session: sessionId,
      topic: activeTopicId,
    });
  },

  searchSessions: async (params: SessionSearchRequest) => {
    set({ isSearching: true, searchError: undefined, inSearchMode: true });
    try {
      const searchResults = await sessionService.searchSessionList(params);
      set({
        searchResults,
        searchKeyword: params.keyword,
        isSearching: false,
      });
    } catch (error) {
      console.error('搜索会话失败:', error);
      set({
        isSearching: false,
        searchError: error instanceof Error ? error.message : '搜索会话失败',
      });
    }
  },

  clearSearchResults: () => {
    set({
      searchResults: [],
      searchKeyword: '',
      searchError: undefined,
      inSearchMode: false,
    });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error?: string) => {
    set({ error });
  },

  clearError: () => {
    set({ error: undefined, searchError: undefined });
  },
});
