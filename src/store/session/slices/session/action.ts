import { StateCreator } from 'zustand';
import sessionService, {
  SessionItem,
  SessionListRequest,
  SessionSearchRequest,
  SessionCreateRequest,
  SessionUpdateRequest,
  BatchSessionListRequest,
} from '@/services/sessions';
import { SessionStore } from '@/store/session';

export interface SessionAction {
  // 获取会话列表
  fetchSessions: (params?: SessionListRequest) => Promise<void>;
  // 搜索会话
  searchSessions: (params: SessionSearchRequest) => Promise<void>;
  // 批量获取会话
  fetchSessionsByIds: (sessionIds: string[]) => Promise<void>;
  // 获取会话详情
  fetchSessionDetail: (id: string) => Promise<SessionItem | undefined>;
  // 创建会话
  createSession: (
    data: SessionCreateRequest
  ) => Promise<SessionItem | undefined>;
  // 更新会话
  updateSession: (
    id: string,
    data: SessionUpdateRequest
  ) => Promise<SessionItem | undefined>;
  // 删除会话
  deleteSession: (id: string) => Promise<void>;
  // 置顶/取消置顶会话
  togglePinSession: (id: string) => Promise<void>;
  // 清除搜索结果
  clearSearchResults: () => void;
  // 设置加载状态
  setLoading: (loading: boolean) => void;
  // 设置错误信息
  setError: (error?: string) => void;
  // 清除错误
  clearError: () => void;
  // 刷新会话列表
  refreshSessions: () => Promise<void>;
  // 添加到最近客户
  addToRecentSessions: (sessionId: string) => void;
  // 从最近客户移除（加入黑名单）
  removeFromRecentSessions: (sessionId: string) => void;
}

export const sessionSlice: StateCreator<SessionStore, [], [], SessionAction> = (
  set,
  get
) => ({
  fetchSessions: async (params?: SessionListRequest) => {
    set({ isLoading: true, error: undefined });
    try {
      const sessions = await sessionService.getSessionList(params);

      const pinnedSessions = sessions.filter((session) => session.pinned);

      set({
        sessions,
        pinnedSessions,
        isLoading: false,
        lastUpdated: Date.now(),
        initialized: true,
        pagination: {
          ...get().pagination,
          page: params?.page || 1,
          pageSize: params?.pageSize || 20,
          total: sessions.length,
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

  fetchSessionsByIds: async (sessionIds: string[]) => {
    if (sessionIds.length === 0) return;

    set({ isLoading: true, error: undefined });
    try {
      const sessions = await sessionService.getSessionListByIds({ sessionIds });
      set({
        sessions,
        isLoading: false,
        lastUpdated: Date.now(),
      });
    } catch (error) {
      console.error('批量获取会话失败:', error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : '批量获取会话失败',
      });
    }
  },

  fetchSessionDetail: async (id: string) => {
    try {
      const session = await sessionService.getSessionDetail(id);

      // 更新会话列表中的对应项
      const currentSessions = get().sessions;
      const updatedSessions = currentSessions.map((s) =>
        s.id === id ? session : s
      );

      set({
        sessions: updatedSessions,
        currentSession: session,
        lastUpdated: Date.now(),
      });

      return session;
    } catch (error) {
      console.error('获取会话详情失败:', error);
      set({
        error: error instanceof Error ? error.message : '获取会话详情失败',
      });
      return undefined;
    }
  },

  createSession: async (data: SessionCreateRequest) => {
    set({ isCreating: true, error: undefined });
    try {
      const newSession = await sessionService.createSession(data);

      const currentSessions = get().sessions;
      set({
        sessions: [newSession, ...currentSessions],
        isCreating: false,
        lastUpdated: Date.now(),
      });

      return newSession;
    } catch (error) {
      console.error('创建会话失败:', error);
      set({
        isCreating: false,
        error: error instanceof Error ? error.message : '创建会话失败',
      });
      return undefined;
    }
  },

  updateSession: async (id: string, data: SessionUpdateRequest) => {
    set({ isUpdating: true, error: undefined });
    try {
      const updatedSession = await sessionService.updateSession(id, data);

      const currentSessions = get().sessions;
      const updatedSessions = currentSessions.map((session) =>
        session.id === id ? updatedSession : session
      );

      // 更新置顶会话列表
      const pinnedSessions = updatedSessions.filter(
        (session) => session.pinned
      );

      set({
        sessions: updatedSessions,
        pinnedSessions,
        currentSession:
          get().currentSessionId === id ? updatedSession : get().currentSession,
        isUpdating: false,
        lastUpdated: Date.now(),
      });

      return updatedSession;
    } catch (error) {
      console.error('更新会话失败:', error);
      set({
        isUpdating: false,
        error: error instanceof Error ? error.message : '更新会话失败',
      });
      return undefined;
    }
  },

  deleteSession: async (id: string) => {
    try {
      // 这里假设有删除接口，实际可能需要根据后端API调整
      // await sessionService.deleteSession(id);

      const currentSessions = get().sessions;
      const updatedSessions = currentSessions.filter(
        (session) => session.id !== id
      );
      const pinnedSessions = updatedSessions.filter(
        (session) => session.pinned
      );

      set({
        sessions: updatedSessions,
        pinnedSessions,
        currentSession:
          get().currentSessionId === id ? undefined : get().currentSession,
        currentSessionId:
          get().currentSessionId === id ? undefined : get().currentSessionId,
        lastUpdated: Date.now(),
      });
      get().removeFromRecentSessions(id);
    } catch (error) {
      console.error('删除会话失败:', error);
      set({
        error: error instanceof Error ? error.message : '删除会话失败',
      });
    }
  },

  togglePinSession: async (id: string) => {
    const session = get().sessions.find((s) => s.id === id);
    if (!session) return;

    try {
      await get().updateSession(id, { pinned: !session.pinned });
    } catch (error) {
      console.error('切换置顶状态失败:', error);
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

  refreshSessions: async () => {
    const currentPagination = get().pagination;
    await get().fetchSessions({
      page: currentPagination.page,
      pageSize: currentPagination.pageSize,
    });
  },

  // 添加到最近客户
  addToRecentSessions: (sessionId: string) => {
    set((state) => {
      const ids = state.recentSessionIds.filter((id) => id !== sessionId);
      ids.unshift(sessionId);
      if (ids.length > 7) ids.length = 7;
      return { recentSessionIds: ids };
    });
  },
  // 从最近客户移除（加入黑名单）
  removeFromRecentSessions: (sessionId: string) => {
    set((state) => ({
      recentSessionBlacklist: [...state.recentSessionBlacklist, sessionId],
    }));
  },
});
