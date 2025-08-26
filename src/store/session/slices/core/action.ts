import { StateCreator } from 'zustand';
import sessionService, {
  SessionListRequest,
  SessionSearchRequest,
} from '@/services/sessions';
import { SessionStore } from '@/store/session';
import { topicsAPI } from '@/services';
import { useChatStore } from '@/store/chat';
import { useCustomerStore } from '@/store/customer';
import { useModelStore } from '@/store/model';
import { syncUrlParams } from '@/utils/url';
import { sessionActiveSelectors } from '../active/selectors';

export interface SessionCoreAction {
  // 获取会话列表
  fetchSessions: (
    params?: SessionListRequest & { autoSelectFirst?: boolean }
  ) => Promise<void>;

  // 强制刷新sessions，忽略缓存
  forceRefreshSessions: (
    params?: SessionListRequest & { autoSelectFirst?: boolean }
  ) => Promise<void>;

  // 切换会话
  switchSession: (sessionId: string, topicId?: string) => Promise<void>;
  // 搜索会话
  searchSessions: (params: SessionSearchRequest) => Promise<void>;
  // 清除搜索结果
  clearSearchResults: () => void;
  // 设置加载状态
  setLoading: (loading: boolean) => void;
  // 设置是否需要刷新标记
  setNeedsRefresh: (needsRefresh: boolean) => void;
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
  fetchSessions: async (
    params?: SessionListRequest & { autoSelectFirst?: boolean }
  ) => {
    set({ isLoading: true, error: undefined });
    try {
      const { autoSelectFirst = true, ...sessionParams } = params || {};
      const { sessions = [] } = await sessionService.getSessionList(
        sessionParams
      );

      set({
        sessions,
        isLoading: false,
        isInitialized: true,
      });

      // 如果有会话但没有选中的会话，并且允许自动选择，则自动选择第一个会话
      const state = get();
      if (autoSelectFirst && sessions.length > 0 && !state.activeSessionId) {
        get().switchSession(sessions[0].id);
      }
    } catch (error) {
      console.error('获取会话列表失败:', error);
      set({
        isLoading: false,
        isInitialized: true,
        error: error instanceof Error ? error.message : '获取会话列表失败',
      });
    }
  },

  forceRefreshSessions: async (
    params?: SessionListRequest & { autoSelectFirst?: boolean }
  ) => {
    // 强制刷新时，先重置初始化状态，然后调用fetchSessions
    set({ isInitialized: false });
    await get().fetchSessions(params);
  },

  switchSession: async (sessionId: string, topicId?: string) => {
    let activeTopicId = topicId;

    // 获取客户拓展配置
    useCustomerStore.getState().getCustomerExtend(sessionId);

    // 先设置当前会话ID，这样选择器才能正确工作
    set({
      activeSessionId: sessionId,
    });

    // 使用选择器获取 activeSessionAgent
    const state = get();
    const activeSessionAgent = sessionActiveSelectors.activeSessionAgent(state);

    // 获取模型配置
    useModelStore
      .getState()
      .fetchModelConfig({ model: activeSessionAgent?.model });

    // 如果没有传入话题ID，则获取会话下的所有话题
    if (!activeTopicId) {
      const topics = await topicsAPI.getTopicList(sessionId);

      activeTopicId = topics?.[0]?.id;
    }

    // 设置当前话题
    set({
      activeTopicId,
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
      userId: get().targetUserId,
    });
  },

  searchSessions: async (params: SessionSearchRequest) => {
    set({ isSearching: true, searchError: undefined, inSearchMode: true });
    try {
      const { sessions = [] } = await sessionService.getSessionList(params);
      set({
        searchResults: sessions,
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

  setNeedsRefresh: (needsRefresh: boolean) => {
    set({ needsRefresh });
  },

  setError: (error?: string) => {
    set({ error });
  },

  clearError: () => {
    set({ error: undefined, searchError: undefined });
  },
});
