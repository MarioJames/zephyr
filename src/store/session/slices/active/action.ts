import { StateCreator } from 'zustand';
import sessionService, {
  SessionListRequest,
  SessionSearchRequest,
} from '@/services/sessions';
import { SessionStore } from '@/store/session';

export interface SessionActiveAction {
  switchSession: (sessionId: string, topicId: string) => Promise<void>;
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
    // 只在浏览器环境中执行
    if (typeof window === 'undefined') return;

    try {
      // 获取URL参数
      const urlParams = new URLSearchParams(window.location.search);
      const sessionParam = urlParams.get('session');
      const topicParam = urlParams.get('topic');
      const openHistoryParam = urlParams.get('openHistory');

      console.log('URL参数初始化:', {
        session: sessionParam,
        topic: topicParam,
        openHistory: openHistoryParam,
      });

      // 如果有session参数，初始化session
      if (sessionParam) {
        const currentSessionId = get().currentSessionId;
        const sessions = get().sessions;

        // 验证sessionId是否存在于会话列表中
        const sessionExists = sessions.some(
          (session) => session.id === sessionParam
        );

        if (!sessionExists) {
          console.warn('Session不存在于会话列表中:', sessionParam);
          // 移除无效的session参数，自动切换到最后对话的会话
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.delete('session');
          newUrl.searchParams.delete('topic'); // 同时移除topic参数
          window.history.replaceState(null, '', newUrl.toString());
          await get().autoSwitchToLastSession();
          return;
        }

        // 如果当前session与URL参数不同，切换session
        if (currentSessionId !== sessionParam) {
          console.log('初始化切换到session:', sessionParam);
          await get().switchSession(sessionParam);
        }

        // 如果有topic参数，需要等待session切换完成后初始化topic
        if (topicParam) {
          // 获取chat store并设置activeTopicId
          const chatStore = useChatStore.getState();
          if (chatStore) {
            console.log('初始化设置topic:', topicParam);
            // 设置活跃的topic ID
            chatStore.activeTopicId = topicParam;

            // 确保topic存在于topics列表中
            // 如果topics还未加载，先加载topics
            if (!chatStore.topicsInit) {
              console.log('加载topics列表以验证topic存在性');
              await chatStore.fetchTopics(sessionParam);
            }

            // 验证topic是否存在
            const topicExists = chatStore.topics.some(
              (t) => t.id === topicParam
            );
            if (!topicExists) {
              console.warn('Topic不存在于当前session中:', topicParam);
              // 清除无效的topic参数
              chatStore.activeTopicId = undefined;
              // 可选：更新URL移除无效的topic参数
              const newUrl = new URL(window.location.href);
              newUrl.searchParams.delete('topic');
              window.history.replaceState(null, '', newUrl.toString());
            } else {
              console.log('Topic初始化成功:', topicParam);
            }
          }
        }
      } else {
        // 如果没有session参数，执行自动切换到最后对话的逻辑
        await get().autoSwitchToLastSession();
      }

      // 处理openHistory参数
      if (openHistoryParam === 'true') {
        console.log('检测到openHistory=true，打开历史面板');
        const globalStore = useGlobalStore.getState();
        if (globalStore) {
          // 设置面板类型为历史模式
          globalStore.setSlotPanelType('history');
          // 确保面板是打开状态
          globalStore.toggleSlotPanel(true);
        }
      }
    } catch (error) {
      console.error('URL参数初始化失败:', error);
    }
  },

  fetchSessions: async (params?: SessionListRequest) => {
    set({ isLoading: true, error: undefined });
    try {
      const { sessions = [], total = 0 } = await sessionService.getSessionList(
        params
      );
      set({
        sessions,
        isLoading: false,
        lastUpdated: Date.now(),
        initialized: true,
        pagination: {
          ...get().pagination,
          page: params?.page || 1,
          pageSize: params?.pageSize || 20,
          total,
          hasMore: sessions.length === (params?.pageSize || 20),
        },
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
});
