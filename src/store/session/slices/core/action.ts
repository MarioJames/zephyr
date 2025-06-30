import { StateCreator } from 'zustand';
import sessionService, {
  SessionListRequest,
  SessionSearchRequest,
} from '@/services/sessions';
import { SessionStore } from '@/store/session';
import qs from 'query-string';
import { topicsAPI } from '@/services';
import { useChatStore } from '@/store/chat';

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
      });
    } catch (error) {
      console.error('获取会话列表失败:', error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : '获取会话列表失败',
      });
    }
  },

  switchSession: async (sessionId: string, topicId?: string) => {
    let activeTopicId = topicId;

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

    // 设置URL参数
    const url = new URL(window.location.href);
    url.searchParams.set('session', sessionId);
    url.searchParams.set('topic', activeTopicId);
    window.history.replaceState(null, '', url.toString());

    // 重置聊天状态
    useChatStore.setState({
      messages: [],
      messagesInit: false,
      topics: [],
      topicsInit: false,
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
