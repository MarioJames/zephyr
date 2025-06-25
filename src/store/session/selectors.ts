import { SessionStore } from './store';

// 基础会话选择器
export const sessionSelectors = {
  // 获取所有会话
  sessions: (state: SessionStore) => state.sessions,

  // 获取当前会话ID
  currentSessionId: (state: SessionStore) => state.currentSessionId,

  // 获取当前会话详情
  currentSession: (state: SessionStore) => state.currentSession,

  // 获取置顶会话列表
  pinnedSessions: (state: SessionStore) => state.pinnedSessions,

  // 获取搜索结果
  searchResults: (state: SessionStore) => state.searchResults,

  // 获取导航历史
  navigationHistory: (state: SessionStore) => state.navigationHistory,

  // 获取上一个会话ID
  previousSessionId: (state: SessionStore) => state.previousSessionId,

  // 根据ID获取会话
  getSessionById: (state: SessionStore) => (id: string) =>
    state.sessions.find((session) => session.id === id),

  // 获取分页信息
  pagination: (state: SessionStore) => state.pagination,

  // 获取搜索关键词
  searchKeyword: (state: SessionStore) => state.searchKeyword,
};

// 会话元数据选择器
export const sessionMetaSelectors = {
  // 当前会话标题
  currentSessionTitle: (state: SessionStore) => state.currentSession?.title,

  // 是否正在加载
  isLoading: (state: SessionStore) => state.isLoading,

  // 是否正在搜索
  isSearching: (state: SessionStore) => state.isSearching,

  // 是否正在创建会话
  isCreating: (state: SessionStore) => state.isCreating,

  // 是否正在更新会话
  isUpdating: (state: SessionStore) => state.isUpdating,

  // 是否正在切换会话
  isSwitching: (state: SessionStore) => state.isSwitching,

  // 是否已初始化
  initialized: (state: SessionStore) => state.initialized,

  // 错误信息
  error: (state: SessionStore) => state.error,

  // 搜索错误信息
  searchError: (state: SessionStore) => state.searchError,

  // 最后更新时间
  lastUpdated: (state: SessionStore) => state.lastUpdated,

  // 是否有错误
  hasError: (state: SessionStore) => !!(state.error || state.searchError),

  // 是否有任何操作正在进行
  isAnyLoading: (state: SessionStore) =>
    state.isLoading ||
    state.isSearching ||
    state.isCreating ||
    state.isUpdating ||
    state.isSwitching,

  // 会话总数
  sessionsCount: (state: SessionStore) => state.sessions.length,

  // 置顶会话总数
  pinnedSessionsCount: (state: SessionStore) => state.pinnedSessions.length,

  // 搜索结果总数
  searchResultsCount: (state: SessionStore) => state.searchResults.length,

  // 是否有更多数据可加载
  hasMore: (state: SessionStore) => state.pagination.hasMore,
};
