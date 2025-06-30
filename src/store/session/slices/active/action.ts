import { StateCreator } from 'zustand';
import sessionService, {
  SessionListRequest,
  SessionSearchRequest,
} from '@/services/sessions';
import { SessionStore } from '@/store/session';
import qs from 'query-string';
import { useGlobalStore } from '@/store/global';

export interface SessionActiveAction {
  initFromUrlParams: () => Promise<void>;
  setActiveSession: (sessionId: string) => void;
  setActiveTopic: (topicId: string) => void;
}

export const sessionActiveAction: StateCreator<
  SessionStore,
  [],
  [],
  SessionActiveAction
> = (set, get) => ({
  initFromUrlParams: async () => {
    const { session, topic, openHistory } = qs.parse(window.location.search);

    // 如果URL参数中存在session和topic，则切换会话和话题
    if (session) {
      get().switchSession(session as string, topic as string | undefined);
    }

    if (openHistory === '1') {
      console.log('检测到openHistory=true，打开历史面板');

      const { updateSystemStatus } = useGlobalStore.getState();

      updateSystemStatus({
        showSlotPanel: true,
        slotPanelType: 'history',
      });
    }
  },

  fetchSessions: async (params?: SessionListRequest) => {
    set({ isLoading: true, error: undefined });
    try {
      const { sessions = [] } = await sessionService.getSessionList(params);
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

  setActiveSession: (sessionId: string) => {
    set({ activeSessionId: sessionId });
  },

  setActiveTopic: (topicId: string) => {
    set({ activeTopicId: topicId });
  },
});
